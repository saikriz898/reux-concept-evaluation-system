const { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } = require('drizzle-orm/pg-core');

const roleEnum = pgEnum('user_role', ['student', 'teacher', 'mentor', 'admin']);

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').default('student'),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  profileImage: text('profile_image'),
  phone: varchar('phone', { length: 15 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const otpTokens = pgTable('otp_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 6 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'email_verify' | 'password_reset'
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { users, otpTokens, roleEnum };
