const { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const notificationTypeEnum = pgEnum('notification_type', ['exam_scheduled', 'result_published', 'system', 'reminder']);

const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  type: notificationTypeEnum('type').notNull(),
  isRead: boolean('is_read').default(false),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { notifications, notificationTypeEnum };
