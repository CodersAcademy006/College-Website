import { register, Counter, Histogram, Gauge, Summary } from 'prom-client';
import { NextResponse } from 'next/server';

// HTTP Metrics
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpErrorsTotal = new Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code', 'error_type'],
});

// Business Metrics
const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of active users',
  labelNames: ['user_type'],
});

const activeSessions = new Gauge({
  name: 'active_sessions',
  help: 'Number of active sessions',
});

const matchesCreated = new Counter({
  name: 'matches_created_total',
  help: 'Total number of mentorship matches created',
  labelNames: ['match_type'],
});

const messagesSent = new Counter({
  name: 'messages_sent_total',
  help: 'Total number of messages sent',
  labelNames: ['message_type'],
});

// Resource Metrics
const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Number of active database connections',
  labelNames: ['database_type'],
});

const redisConnections = new Gauge({
  name: 'redis_connections',
  help: 'Number of active Redis connections',
});

const cacheHitRate = new Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate',
  labelNames: ['cache_type'],
});

// Performance Metrics
const requestLatency = new Summary({
  name: 'request_latency_seconds',
  help: 'Request latency in seconds',
  labelNames: ['endpoint'],
  percentiles: [0.5, 0.9, 0.95, 0.99],
});

const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type', 'database'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
});

// Middleware to collect metrics
export async function metricsMiddleware(req: Request) {
  const start = Date.now();
  const { method, url } = req;
  const route = new URL(url).pathname;

  try {
    const response = await NextResponse.next();
    const duration = (Date.now() - start) / 1000;
    
    // Record request duration
    httpRequestDuration.observe(
      { method, route, status_code: response.status },
      duration
    );
    
    // Record total requests
    httpRequestsTotal.inc({
      method,
      route,
      status_code: response.status,
    });

    // Record latency
    requestLatency.observe({ endpoint: route }, duration);

    // Record errors if status >= 400
    if (response.status >= 400) {
      httpErrorsTotal.inc({
        method,
        route,
        status_code: response.status,
        error_type: response.status >= 500 ? 'server_error' : 'client_error',
      });
    }

    return response;
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestDuration.observe(
      { method, route, status_code: 500 },
      duration
    );
    
    httpRequestsTotal.inc({
      method,
      route,
      status_code: 500,
    });

    httpErrorsTotal.inc({
      method,
      route,
      status_code: 500,
      error_type: 'server_error',
    });

    throw error;
  }
}

// Metrics endpoint handler
export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    return new NextResponse('Error generating metrics', { status: 500 });
  }
}

// Update metrics periodically
export function updateMetrics() {
  // Update active users (example)
  activeUsers.set({ user_type: 'student' }, Math.floor(Math.random() * 800));
  activeUsers.set({ user_type: 'faculty' }, Math.floor(Math.random() * 100));
  activeUsers.set({ user_type: 'staff' }, Math.floor(Math.random() * 50));
  
  // Update active sessions
  activeSessions.set(Math.floor(Math.random() * 500));
  
  // Update database connections
  databaseConnections.set({ database_type: 'postgres' }, Math.floor(Math.random() * 20));
  databaseConnections.set({ database_type: 'mongodb' }, Math.floor(Math.random() * 15));
  
  // Update Redis connections
  redisConnections.set(Math.floor(Math.random() * 30));
  
  // Update cache hit rates
  cacheHitRate.set({ cache_type: 'redis' }, Math.random());
  cacheHitRate.set({ cache_type: 'memory' }, Math.random());
}

// Start periodic updates
setInterval(updateMetrics, 15000); 