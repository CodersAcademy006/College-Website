import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { createClient } from 'redis';
import { Client as ElasticClient } from '@elastic/elasticsearch';
import { MongoClient } from 'mongodb';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface LoadResult {
  database: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

async function loadPostgresData(): Promise<LoadResult> {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'college_db',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    
    // Read and execute SQL file
    const sqlPath = path.join(__dirname, '../data/postgres_test_data.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL file into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      await client.query(statement);
    }
    
    return {
      database: 'PostgreSQL',
      status: 'success',
      message: 'Data loaded successfully',
      details: {
        statementsExecuted: statements.length
      }
    };
  } catch (error) {
    return {
      database: 'PostgreSQL',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await client.end();
  }
}

async function loadRedisData(): Promise<LoadResult> {
  const client = createClient();
  
  try {
    await client.connect();
    
    // Read Redis commands file
    const redisPath = path.join(__dirname, '../data/redis_test_data.txt');
    const redisContent = fs.readFileSync(redisPath, 'utf8');
    
    // Split into commands and execute
    const commands = redisContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));
    
    for (const command of commands) {
      const [cmd, ...args] = command.split(' ');
      await client.sendCommand([cmd, ...args]);
    }
    
    return {
      database: 'Redis',
      status: 'success',
      message: 'Data loaded successfully',
      details: {
        commandsExecuted: commands.length
      }
    };
  } catch (error) {
    return {
      database: 'Redis',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await client.quit();
  }
}

async function loadElasticsearchData(): Promise<LoadResult> {
  const client = new ElasticClient({ node: 'http://localhost:9200' });
  
  try {
    // Read Elasticsearch data file
    const esPath = path.join(__dirname, '../data/elasticsearch_test_data.json');
    const esContent = fs.readFileSync(esPath, 'utf8');
    const data = JSON.parse(esContent);
    
    // Create index with mappings
    await client.indices.create({
      index: 'college',
      body: {
        mappings: data.mappings,
        settings: data.settings
      }
    });
    
    // Bulk insert documents
    const bulkBody = data.documents.flatMap((doc: any) => [
      { index: { _index: 'college', _id: doc._id } },
      doc
    ]);
    
    const response = await client.bulk({ body: bulkBody });
    
    return {
      database: 'Elasticsearch',
      status: 'success',
      message: 'Data loaded successfully',
      details: {
        documentsIndexed: data.documents.length,
        errors: response.errors
      }
    };
  } catch (error) {
    return {
      database: 'Elasticsearch',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function loadMongoDBData(): Promise<LoadResult> {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('college');
    
    // Read MongoDB data file
    const mongoPath = path.join(__dirname, '../data/mongodb_test_data.json');
    const mongoContent = fs.readFileSync(mongoPath, 'utf8');
    const data = JSON.parse(mongoContent);
    
    // Load each collection
    for (const collection of data.collections) {
      await db.collection(collection.name).insertMany(collection.documents);
    }
    
    return {
      database: 'MongoDB',
      status: 'success',
      message: 'Data loaded successfully',
      details: {
        collectionsLoaded: data.collections.length,
        totalDocuments: data.collections.reduce(
          (sum: number, coll: any) => sum + coll.documents.length,
          0
        )
      }
    };
  } catch (error) {
    return {
      database: 'MongoDB',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await client.close();
  }
}

async function cleanupPostgresData(): Promise<LoadResult> {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'college_db',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    
    // Drop all tables in reverse order of dependencies
    const tables = [
      'grades',
      'attendance',
      'enrollments',
      'courses',
      'faculty',
      'students',
      'users'
    ];
    
    for (const table of tables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
    
    return {
      database: 'PostgreSQL',
      status: 'success',
      message: 'Data cleaned up successfully',
      details: {
        tablesDropped: tables.length
      }
    };
  } catch (error) {
    return {
      database: 'PostgreSQL',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await client.end();
  }
}

async function cleanupRedisData(): Promise<LoadResult> {
  const client = createClient();
  
  try {
    await client.connect();
    
    // Get all keys matching our patterns
    const patterns = [
      'user:session:*',
      'course:*',
      'online:users',
      'attendance:*',
      'notifications:*',
      'materials:*',
      'progress:*',
      'chat:*',
      'schedule:*'
    ];
    
    const keys = await Promise.all(
      patterns.map(pattern => client.keys(pattern))
    );
    
    const allKeys = keys.flat();
    
    if (allKeys.length > 0) {
      await client.del(allKeys);
    }
    
    return {
      database: 'Redis',
      status: 'success',
      message: 'Data cleaned up successfully',
      details: {
        keysDeleted: allKeys.length
      }
    };
  } catch (error) {
    return {
      database: 'Redis',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await client.quit();
  }
}

async function cleanupElasticsearchData(): Promise<LoadResult> {
  const client = new ElasticClient({ node: 'http://localhost:9200' });
  
  try {
    // Delete index if it exists
    const indexExists = await client.indices.exists({ index: 'college' });
    if (indexExists) {
      await client.indices.delete({ index: 'college' });
    }
    
    return {
      database: 'Elasticsearch',
      status: 'success',
      message: 'Data cleaned up successfully',
      details: {
        indexDeleted: indexExists
      }
    };
  } catch (error) {
    return {
      database: 'Elasticsearch',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function cleanupMongoDBData(): Promise<LoadResult> {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('college');
    
    // Drop all collections
    const collections = ['chat_messages', 'chat_rooms', 'user_presence'];
    const results = await Promise.all(
      collections.map(collection => 
        db.collection(collection).drop().catch(() => null)
      )
    );
    
    return {
      database: 'MongoDB',
      status: 'success',
      message: 'Data cleaned up successfully',
      details: {
        collectionsDropped: results.filter(Boolean).length
      }
    };
  } catch (error) {
    return {
      database: 'MongoDB',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await client.close();
  }
}

async function checkDependencies(): Promise<void> {
  const requiredServices = [
    { name: 'PostgreSQL', command: 'pg_isready' },
    { name: 'Redis', command: 'redis-cli ping' },
    { name: 'Elasticsearch', command: 'curl -s http://localhost:9200' },
    { name: 'MongoDB', command: 'mongosh --eval "db.version()"' }
  ];

  console.log('Checking required services...\n');

  for (const service of requiredServices) {
    try {
      await execAsync(service.command);
      console.log(`✓ ${service.name} is running`);
    } catch (error) {
      console.error(`✗ ${service.name} is not running`);
      throw new Error(`${service.name} service is required but not running`);
    }
  }
}

async function loadAllData() {
  try {
    // Check if all required services are running
    await checkDependencies();
    
    console.log('\nStarting data loading...\n');
    
    const results = await Promise.all([
      loadPostgresData(),
      loadRedisData(),
      loadElasticsearchData(),
      loadMongoDBData()
    ]);
    
    results.forEach(result => {
      console.log(`\n${result.database} Loading:`);
      console.log(`Status: ${result.status}`);
      console.log(`Message: ${result.message}`);
      if (result.details) {
        console.log('Details:', JSON.stringify(result.details, null, 2));
      }
    });
    
    const hasErrors = results.some(r => r.status === 'error');
    if (hasErrors) {
      console.error('\nData loading completed with errors');
      process.exit(1);
    } else {
      console.log('\nAll data loaded successfully');
    }
  } catch (error) {
    console.error('Error during data loading:', error);
    process.exit(1);
  }
}

async function cleanupAllData() {
  try {
    console.log('Starting data cleanup...\n');
    
    const results = await Promise.all([
      cleanupPostgresData(),
      cleanupRedisData(),
      cleanupElasticsearchData(),
      cleanupMongoDBData()
    ]);
    
    results.forEach(result => {
      console.log(`\n${result.database} Cleanup:`);
      console.log(`Status: ${result.status}`);
      console.log(`Message: ${result.message}`);
      if (result.details) {
        console.log('Details:', JSON.stringify(result.details, null, 2));
      }
    });
    
    const hasErrors = results.some(r => r.status === 'error');
    if (hasErrors) {
      console.error('\nData cleanup completed with errors');
      process.exit(1);
    } else {
      console.log('\nAll data cleaned up successfully');
    }
  } catch (error) {
    console.error('Error during data cleanup:', error);
    process.exit(1);
  }
}

// Add script to package.json
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

packageJson.scripts['load-test-data'] = 'ts-node src/scripts/loadTestData.ts';
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Check if cleanup is requested
const isCleanup = process.argv.includes('--cleanup');

if (isCleanup) {
  cleanupAllData().catch(console.error);
} else {
  loadAllData().catch(console.error);
} 