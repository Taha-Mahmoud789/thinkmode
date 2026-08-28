const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

async function main() {
  console.log('[db:indexes:memory] Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create({ instance: { dbName: 'thinkmode' } });
  const uri = mongod.getUri();
  console.log(`[db:indexes:memory] URI: ${uri}`);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('thinkmode');
  // Create indexes like scripts/create-indexes.ts does
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('sessions').createIndex({ tokenHash: 1 }, { unique: true });
  await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('bookmarks').createIndex({ userId: 1, slug: 1 }, { unique: true });
  await db.collection('comments').createIndex({ articleSlug: 1, createdAt: -1 });
  await db.collection('password_resets').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('email_verifications').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log('[db:indexes:memory] Indexes created');
  await client.close();
  await mongod.stop();
  console.log('[db:indexes:memory] Done');
}
main().catch(e => { console.error(e); process.exit(1); });
