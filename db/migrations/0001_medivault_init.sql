CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE role AS ENUM ('patient', 'doctor', 'hospital');
CREATE TYPE document_type AS ENUM ('lab_report', 'prescription', 'imaging', 'diagnosis', 'discharge_summary', 'hospital_proof');
CREATE TYPE grant_status AS ENUM ('pending', 'approved', 'rejected', 'revoked');
CREATE TYPE grant_access_type AS ENUM ('read_only', 'download', 'print');
CREATE TYPE audit_action AS ENUM ('upload', 'view_document', 'download_document', 'share_document', 'grant_access', 'revoke_access', 'emergency_access');
CREATE TYPE audit_status AS ENUM ('success', 'denied', 'failed');
CREATE TYPE emergency_status AS ENUM ('active', 'expired', 'revoked');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role role NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  emergency_contact_phone VARCHAR(20),
  emergency_contact_name VARCHAR(255),
  emergency_consent_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(120) NOT NULL UNIQUE,
  specialization VARCHAR(120) NOT NULL,
  is_license_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  hospital_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  is_license_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  uploaded_by_user_id UUID NOT NULL REFERENCES users(id),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  document_type document_type NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  chunk_size_bytes INTEGER NOT NULL DEFAULT 524288,
  total_chunks INTEGER NOT NULL,
  file_checksum_sha256 VARCHAR(128) NOT NULL,
  encrypted BOOLEAN NOT NULL DEFAULT true,
  dek_wrapped TEXT NOT NULL,
  dek_iv TEXT NOT NULL,
  visit_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE document_blobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  encrypted_chunk TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id, chunk_index)
);

CREATE TABLE document_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  grantee_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status grant_status NOT NULL DEFAULT 'pending',
  access_type grant_access_type NOT NULL DEFAULT 'read_only',
  request_reason TEXT,
  granted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  wrapped_dek_for_grantee TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_scope VARCHAR(200) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  linked_grant_id UUID REFERENCES document_access_grants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE emergency_access_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  approved_by_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  requester_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status emergency_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action audit_action NOT NULL,
  status audit_status NOT NULL DEFAULT 'success',
  reason TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata_json TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  channel VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX documents_patient_created_idx ON documents(patient_id, created_at);
CREATE INDEX documents_uploaded_by_idx ON documents(uploaded_by_user_id);
CREATE INDEX document_blobs_document_chunk_idx ON document_blobs(document_id, chunk_index);
CREATE INDEX grants_grantee_status_idx ON document_access_grants(grantee_user_id, status);
CREATE INDEX grants_patient_status_idx ON document_access_grants(patient_id, status);
CREATE INDEX access_requests_patient_status_idx ON access_requests(patient_id, status);
CREATE INDEX access_requests_requester_status_idx ON access_requests(requester_user_id, status);
CREATE INDEX audit_logs_patient_time_idx ON audit_logs(patient_id, created_at);
CREATE INDEX audit_logs_actor_time_idx ON audit_logs(actor_user_id, created_at);
CREATE INDEX notifications_user_status_idx ON notifications(user_id, status);
