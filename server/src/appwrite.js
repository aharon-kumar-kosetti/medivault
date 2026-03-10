import { Client, Storage, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || 'medivault-documents';

/**
 * Ensure the storage bucket exists. Call once on server startup.
 */
export async function ensureBucket() {
  const bucket = await storage.getBucket(BUCKET_ID);
  console.log(`✓ Appwrite bucket "${BUCKET_ID}" ready (extensions: ${bucket.allowedFileExtensions?.join(', ') || 'all'})`);
}

/**
 * Upload an encrypted buffer to Appwrite Storage.
 * @param {Buffer} buffer  The encrypted file content
 * @param {string} filename  Display name for the stored file
 * @returns {Promise<string>} The Appwrite file ID
 */
export async function uploadToAppwrite(buffer, filename) {
  // Force an allowed extension — content is encrypted binary regardless of original type
  const safeName = filename.replace(/\.[^.]+$/, '') + '.pdf';
  const file = new File([buffer], safeName, { type: 'application/octet-stream' });
  const result = await storage.createFile(BUCKET_ID, ID.unique(), file);
  return result.$id;
}

/**
 * Download a file from Appwrite Storage.
 * @param {string} fileId  The Appwrite file ID
 * @returns {Promise<Buffer>} The file content as a Buffer
 */
export async function downloadFromAppwrite(fileId) {
  const result = await storage.getFileDownload(BUCKET_ID, fileId);
  if (Buffer.isBuffer(result)) return result;
  if (result instanceof ArrayBuffer) return Buffer.from(new Uint8Array(result));
  if (result instanceof Uint8Array) return Buffer.from(result);
  return Buffer.from(result);
}

/**
 * Delete a file from Appwrite Storage.
 * @param {string} fileId  The Appwrite file ID
 */
export async function deleteFromAppwrite(fileId) {
  await storage.deleteFile(BUCKET_ID, fileId);
}
