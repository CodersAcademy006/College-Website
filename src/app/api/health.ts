import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { Client } from '@elastic/elasticsearch';
import { MongoClient } from 'mongodb';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Initialize clients
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redis = new Redis(process.env.REDIS_URL);

const elasticsearch = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

const mongoClient = new MongoClient(process.env.MONGODB_URL);

// Health check status interface
interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    postgres: {
      status: 'up' | 'down';
      latency: number;
      connections: number;
      version?: string;
    };
    redis: {
      status: 'up' | 'down';
      latency: number;
      memory_used: number;
      connected_clients: number;
    };
    elasticsearch: {
      status: 'up' | 'down';
      latency: number;
      cluster_health?: string;
      number_of_nodes?: number;
    };
    mongodb: {
      status: 'up' | 'down';
      latency: number;
      connections: number;
      version?: string;
    };
  };
  system: {
    memory: {
      total: number;
      used: number;
      free: number;
    };
    cpu: {
      usage: number;
      load: number[];
    };
    disk: {
      total: number;
      used: number;
      free: number;
    };
  };
}

// Check database health
async function checkPostgresHealth(): Promise<HealthStatus['services']['postgres']> {
  const start = Date.now();
  try {
    const result = await pgPool.query('SELECT version(), count(*) FROM pg_stat_activity');
    return {
      status: 'up',
      latency: Date.now() - start,
      connections: parseInt(result.rows[1].count),
      version: result.rows[0].version,
    };
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - start,
      connections: 0,
    };
  }
}

// Check Redis health
async function checkRedisHealth(): Promise<HealthStatus['services']['redis']> {
  const start = Date.now();
  try {
    const info = await redis.info();
    const memoryUsed = parseInt(info.match(/used_memory:(\d+)/)?.[1] || '0');
    const connectedClients = parseInt(info.match(/connected_clients:(\d+)/)?.[1] || '0');
    
    return {
      status: 'up',
      latency: Date.now() - start,
      memory_used: memoryUsed,
      connected_clients: connectedClients,
    };
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - start,
      memory_used: 0,
      connected_clients: 0,
    };
  }
}

// Check Elasticsearch health
async function checkElasticsearchHealth(): Promise<HealthStatus['services']['elasticsearch']> {
  const start = Date.now();
  try {
    const health = await elasticsearch.cluster.health();
    const stats = await elasticsearch.cluster.stats();
    
    return {
      status: 'up',
      latency: Date.now() - start,
      cluster_health: health.body.status,
      number_of_nodes: stats.body.nodes.count.total,
    };
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - start,
    };
  }
}

// Check MongoDB health
async function checkMongoHealth(): Promise<HealthStatus['services']['mongodb']> {
  const start = Date.now();
  try {
    await mongoClient.connect();
    const admin = mongoClient.db().admin();
    const serverStatus = await admin.serverStatus();
    const buildInfo = await admin.buildInfo();
    
    return {
      status: 'up',
      latency: Date.now() - start,
      connections: serverStatus.connections.current,
      version: buildInfo.version,
    };
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - start,
      connections: 0,
    };
  }
}

// Check system resources
async function checkSystemResources(): Promise<HealthStatus['system']> {
  try {
    const { stdout: memoryInfo } = await execAsync('free -b');
    const { stdout: cpuInfo } = await execAsync('top -bn1 | grep "Cpu(s)"');
    const { stdout: diskInfo } = await execAsync('df -B1 /');
    
    const memory = memoryInfo.split('\n')[1].split(/\s+/);
    const cpu = cpuInfo.split(/\s+/);
    const disk = diskInfo.split('\n')[1].split(/\s+/);
    
    return {
      memory: {
        total: parseInt(memory[1]),
        used: parseInt(memory[2]),
        free: parseInt(memory[3]),
      },
      cpu: {
        usage: parseFloat(cpu[1]),
        load: [parseFloat(cpu[9]), parseFloat(cpu[10]), parseFloat(cpu[11])],
      },
      disk: {
        total: parseInt(disk[1]),
        used: parseInt(disk[2]),
        free: parseInt(disk[3]),
      },
    };
  } catch (error) {
    return {
      memory: { total: 0, used: 0, free: 0 },
      cpu: { usage: 0, load: [0, 0, 0] },
      disk: { total: 0, used: 0, free: 0 },
    };
  }
}

// Health check endpoint handler
export async function GET() {
  try {
    const [postgres, redis, elasticsearch, mongodb, system] = await Promise.all([
      checkPostgresHealth(),
      checkRedisHealth(),
      checkElasticsearchHealth(),
      checkMongoHealth(),
      checkSystemResources(),
    ]);

    const services = { postgres, redis, elasticsearch, mongodb };
    const allServicesUp = Object.values(services).every((service) => service.status === 'up');
    const anyServiceDown = Object.values(services).some((service) => service.status === 'down');

    const healthStatus: HealthStatus = {
      status: allServicesUp ? 'healthy' : anyServiceDown ? 'unhealthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      services,
      system,
    };

    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
} 