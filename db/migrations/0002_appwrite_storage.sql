-- Add Appwrite file storage support to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS appwrite_file_id TEXT;
