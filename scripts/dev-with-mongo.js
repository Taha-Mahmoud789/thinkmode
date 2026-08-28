#!/usr/bin/env node
// Dev helper: starts in-memory MongoDB and runs `next dev` with MONGODB_URI set.
// Makes the site fully dynamic (comments, bookmarks, auth) without needing Atlas.
// For production, set a real MONGODB_URI in Vercel env vars — this script is dev-only.

const { spawn } = require('child_process');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  console.log('[dev:mongo] Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create({
    instance: { dbName: 'thinkmode' },
  });
  const uri = mongod.getUri();
  console.log(`[dev:mongo] URI: ${uri}`);
  console.log('[dev:mongo] Starting next dev...\n');

  const env = { ...process.env, MONGODB_URI: uri, MONGODB_DB: 'thinkmode' };

  const next = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    env,
    shell: true,
  });

  const cleanup = async () => {
    console.log('\n[dev:mongo] Shutting down...');
    next.kill();
    await mongod.stop();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  next.on('exit', async (code) => {
    await mongod.stop();
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error('[dev:mongo] Failed:', err);
  process.exit(1);
});
