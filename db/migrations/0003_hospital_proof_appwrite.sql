-- Store hospital proof document reference in Appwrite
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS proof_file_id TEXT;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS proof_filename VARCHAR(255);
