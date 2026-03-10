import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { documentAccessGrants, documents } from './documents';
import { hospitals, patients, users } from './users';

export const auditActionEnum = pgEnum('audit_action', [
  'upload',
  'view_document',
  'download_document',
  'share_document',
  'grant_access',
  'revoke_access',
  'emergency_access',
]);

export const auditStatusEnum = pgEnum('audit_status', ['success', 'denied', 'failed']);

export const emergencyStatusEnum = pgEnum('emergency_status', ['active', 'expired', 'revoked']);

export const accessRequests = pgTable('access_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  requesterUserId: uuid('requester_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  requestedScope: varchar('requested_scope', { length: 200 }).notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  linkedGrantId: uuid('linked_grant_id').references(() => documentAccessGrants.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  patientStatusIdx: index('access_requests_patient_status_idx').on(table.patientId, table.status),
  requesterStatusIdx: index('access_requests_requester_status_idx').on(table.requesterUserId, table.status),
}));

export const emergencyAccessEvents = pgTable('emergency_access_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  approvedByHospitalId: uuid('approved_by_hospital_id').references(() => hospitals.id, { onDelete: 'set null' }),
  requesterUserId: uuid('requester_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  status: emergencyStatusEnum('status').default('active').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'set null' }),
  actorUserId: uuid('actor_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: auditActionEnum('action').notNull(),
  status: auditStatusEnum('status').default('success').notNull(),
  reason: text('reason'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  metadataJson: text('metadata_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  patientTimeIdx: index('audit_logs_patient_time_idx').on(table.patientId, table.createdAt),
  actorTimeIdx: index('audit_logs_actor_time_idx').on(table.actorUserId, table.createdAt),
}));

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  channel: varchar('channel', { length: 40 }).notNull(),
  status: varchar('status', { length: 20 }).default('unread').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userStatusIdx: index('notifications_user_status_idx').on(table.userId, table.status),
}));
