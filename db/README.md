# Database Schema (Drizzle + PostgreSQL)

This folder contains the upcoming PostgreSQL schema for MediVault dashboards and secure document vault workflows.

## Files

- `drizzle.config.ts`: Drizzle configuration.
- `schema/`: Drizzle table definitions.
- `migrations/0001_medivault_init.sql`: SQL baseline migration.

## Core domains

- Identity and role accounts: `users`, `patients`, `doctors`, `hospitals`
- Medical vault metadata: `documents`, `document_access_grants`
- Workflow and governance: `access_requests`, `emergency_access_events`, `audit_logs`, `notifications`

## Vault implementation contract (PostgreSQL-only target)

1. Upload API receives file over TLS.
2. Backend generates per-document DEK and encrypts in memory using AES-256-GCM.
3. PostgreSQL stores encrypted file chunks in `document_blobs.encrypted_chunk` (base64 text payload).
4. PostgreSQL stores metadata + wrapped DEK (`dek_wrapped`) + IV (`dek_iv`) in `documents`.
5. Every access attempt writes to `audit_logs`.

### Default operational limits (MVP)

- Max upload size: `20 MB`
- Chunk size: `512 KB`
- Total chunks per file are recorded in `documents.total_chunks`
- Chunk rows are ordered by `(document_id, chunk_index)`

### Migration path for future scale

When object storage becomes available later, keep `documents` metadata and move blob payloads from `document_blobs` to object storage with a backfill job.

## Suggested Drizzle commands

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Set `DATABASE_URL` before running commands.
