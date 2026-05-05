const { pgTable, uuid, varchar, integer, timestamp, text } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 10 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

const batches = pgTable('batches', {
  id: uuid('id').primaryKey().defaultRandom(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(), // e.g. "2022-2026"
  section: varchar('section', { length: 5 }).notNull(), // e.g. "A", "B"
  semester: integer('semester').notNull(),
  academicYear: varchar('academic_year', { length: 10 }).notNull(), // "2024-25"
  createdAt: timestamp('created_at').defaultNow(),
});

const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }),
  batchId: uuid('batch_id').references(() => batches.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
});

const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 15 }).unique().notNull(),
  semester: integer('semester').notNull(),
  credits: integer('credits').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  conceptTags: text('concept_tags').array(), // Drizzle array support
  orderIndex: integer('order_index'),
  createdAt: timestamp('created_at').defaultNow(),
});

const teacherBatchAssignments = pgTable('teacher_batch_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').references(() => users.id, { onDelete: 'cascade' }),
  batchId: uuid('batch_id').references(() => batches.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

module.exports = { departments, batches, enrollments, subjects, topics, teacherBatchAssignments };
