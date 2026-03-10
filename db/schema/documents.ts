import { bigint, boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { hospitals, patients, users } from './users';

export const documentTypeEnum = pgEnum('document_type', [
  'lab_report',
  'prescription',
  'imaging',
  'diagnosis',
  'discharge_summary',
  'hospital_proof',
]);

export const grantStatusEnum = pgEnum('grant_status', ['pending', 'approved', 'rejected', 'revoked']);

export const grantAccessTypeEnum = pgEnum('grant_access_type', ['read_only', 'download', 'print']);

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  uploadedByUserId: uuid('uploaded_by_user_id').notNull().references(() => users.id),
  hospitalId: uuid('hospital_id').references(() => hospitals.id, { onDelete: 'set null' }),
  documentType: documentTypeEnum('document_type').notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 120 }).notNull(),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
  chunkSizeBytes: integer('chunk_size_bytes').notNull().default(524288),
  totalChunks: integer('total_chunks').notNull(),
  fileChecksumSha256: varchar('file_checksum_sha256', { length: 128 }).notNull(),
  encrypted: boolean('encrypted').default(true).notNull(),
  dekWrapped: text('dek_wrapped').notNull(),
  dekIv: text('dek_iv').notNull(),
  visitDate: timestamp('visit_date', { mode: 'date' }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  patientCreatedIdx: index('documents_patient_created_idx').on(table.patientId, table.createdAt),
  uploadedByIdx: index('documents_uploaded_by_idx').on(table.uploadedByUserId),
}));

export const documentBlobs = pgTable('document_blobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  chunkIndex: integer('chunk_index').notNull(),
  encryptedChunk: text('encrypted_chunk').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  documentChunkIdx: uniqueIndex('document_blobs_document_chunk_idx').on(table.documentId, table.chunkIndex),
}));

export const documentAccessGrants = pgTable('document_access_grants', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  granteeUserId: uuid('grantee_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: grantStatusEnum('status').default('pending').notNull(),
  accessType: grantAccessTypeEnum('access_type').default('read_only').notNull(),
  requestReason: text('request_reason'),
  grantedAt: timestamp('granted_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  wrappedDekForGrantee: text('wrapped_dek_for_grantee').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  byGranteeStatusIdx: index('grants_grantee_status_idx').on(table.granteeUserId, table.status),
  byPatientStatusIdx: index('grants_patient_status_idx').on(table.patientId, table.status),
}));
