import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { createClient } from 'redis';
import { Client as ElasticClient } from '@elastic/elasticsearch';
import { MongoClient } from 'mongodb';

interface ValidationResult {
  database: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

async function validatePostgresData(): Promise<ValidationResult> {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'college_db',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    
    // Validate users
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    const studentsResult = await client.query('SELECT COUNT(*) FROM students');
    const facultyResult = await client.query('SELECT COUNT(*) FROM faculty');
    const coursesResult = await client.query('SELECT COUNT(*) FROM courses');
    
    // Validate relationships
    const enrollmentResult = await client.query(`
      SELECT COUNT(*) FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE s.id IS NULL OR c.id IS NULL
    `);

    return {
      database: 'PostgreSQL',
      status: 'success',
      message: 'Data validation successful',
      details: {
        users: parseInt(usersResult.rows[0].count),
        students: parseInt(studentsResult.rows[0].count),
        faculty: parseInt(facultyResult.rows[0].count),
        courses: parseInt(coursesResult.rows[0].count),
        invalidEnrollments: parseInt(enrollmentResult.rows[0].count)
      }
    };
  } catch (error) {
    return {
      database: 'PostgreSQL',
      status: 'error',
      message: error.message
    };
  } finally {
    await client.end();
  }
}

async function validateRedisData(): Promise<ValidationResult> {
  const client = createClient();
  
  try {
    await client.connect();
    
    // Validate session data
    const sessionKeys = await client.keys('user:session:*');
    const courseKeys = await client.keys('course:*');
    const onlineUsers = await client.sMembers('online:users');
    
    // Check TTLs
    const sessionTTLs = await Promise.all(
      sessionKeys.map(key => client.ttl(key))
    );
    
    return {
      database: 'Redis',
      status: 'success',
      message: 'Data validation successful',
      details: {
        activeSessions: sessionKeys.length,
        courseCacheEntries: courseKeys.length,
        onlineUsers: onlineUsers.length,
        validSessionTTLs: sessionTTLs.filter(ttl => ttl > 0).length
      }
    };
  } catch (error) {
    return {
      database: 'Redis',
      status: 'error',
      message: error.message
    };
  } finally {
    await client.quit();
  }
}

async function validateElasticsearchData(): Promise<ValidationResult> {
  const client = new ElasticClient({ node: 'http://localhost:9200' });
  
  try {
    // Validate index
    const indexExists = await client.indices.exists({ index: 'college' });
    if (!indexExists) {
      throw new Error('Index does not exist');
    }
    
    // Get document counts
    const counts = await client.count({ index: 'college' });
    
    // Validate mappings
    const mappings = await client.indices.getMapping({ index: 'college' });
    
    return {
      database: 'Elasticsearch',
      status: 'success',
      message: 'Data validation successful',
      details: {
        documentCount: counts.count,
        mappings: mappings.body.college.mappings
      }
    };
  } catch (error) {
    return {
      database: 'Elasticsearch',
      status: 'error',
      message: error.message
    };
  }
}

async function validateMongoDBData(): Promise<ValidationResult> {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('college');
    
    // Validate collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get document counts
    const messageCount = await db.collection('chat_messages').countDocuments();
    const roomCount = await db.collection('chat_rooms').countDocuments();
    const presenceCount = await db.collection('user_presence').countDocuments();
    
    // Validate relationships
    const invalidMessages = await db.collection('chat_messages').countDocuments({
      roomId: { $exists: false }
    });
    
    return {
      database: 'MongoDB',
      status: 'success',
      message: 'Data validation successful',
      details: {
        collections: collectionNames,
        messageCount,
        roomCount,
        presenceCount,
        invalidMessages
      }
    };
  } catch (error) {
    return {
      database: 'MongoDB',
      status: 'error',
      message: error.message
    };
  } finally {
    await client.close();
  }
}

async function validateAllData() {
  console.log('Starting data validation...\n');
  
  const results = await Promise.all([
    validatePostgresData(),
    validateRedisData(),
    validateElasticsearchData(),
    validateMongoDBData()
  ]);
  
  results.forEach(result => {
    console.log(`\n${result.database} Validation:`);
    console.log(`Status: ${result.status}`);
    console.log(`Message: ${result.message}`);
    if (result.details) {
      console.log('Details:', JSON.stringify(result.details, null, 2));
    }
  });
  
  const hasErrors = results.some(r => r.status === 'error');
  if (hasErrors) {
    console.error('\nValidation completed with errors');
    process.exit(1);
  } else {
    console.log('\nAll validations passed successfully');
  }
}

validateAllData().catch(console.error); 