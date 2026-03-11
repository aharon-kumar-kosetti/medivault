// Vercel serverless entry point — wraps the Express app as a single serverless function.
// All requests matching /health, /auth/*, and /api/* are rewritten here by vercel.json.
import app from '../server/src/app.js';

export default app;
