import 'dotenv/config';          // load .env BEFORE anything else
import { testConnection } from './db.js';
import { ensureBucket } from './appwrite.js';
import app from './app.js';

const port = Number(process.env.API_PORT || 3001);
const host = process.env.API_HOST || '0.0.0.0';

async function start() {
  // Verify DB connection before accepting requests
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('❌  Could not connect to database. Check DATABASE_URL in .env');
    process.exit(1);
  }
  console.log('✅  Database connection verified');

  // Ensure Appwrite storage bucket exists
  if (process.env.APPWRITE_API_KEY) {
    try {
      await ensureBucket();
    } catch (err) {
      console.warn('⚠️  Appwrite bucket setup failed:', err.message);
    }
  } else {
    console.warn('⚠️  APPWRITE_API_KEY not set — file uploads will fail. Add it to .env');
  }

  app.listen(port, host, () => {
    console.log(`✅  MediVault API running on http://${host}:${port}`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
