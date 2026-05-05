const { pgTable, uuid, varchar, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // e.g. "question.create"
  entityType: varchar('entity_type', { length: 50 }).notNull(), // e.g. "question"
  entityId: uuid('entity_id'),
  meta: jsonb('meta'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { auditLogs };
