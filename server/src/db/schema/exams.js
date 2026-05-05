const { pgTable, uuid, varchar, text, integer, timestamp, boolean } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const { subjects, batches } = require('./academic');
const { users } = require('./users');
const { questions } = require('./questions');

const exams = pgTable('exams', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 150 }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  batchId: uuid('batch_id').references(() => batches.id, { onDelete: 'cascade' }),
  createdBy: uuid('created_by').references(() => users.id),
  instructions: text('instructions'),
  totalMarks: integer('total_marks').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  isPublished: boolean('is_published').default(false),
  resultsPublished: boolean('results_published').default(false),
  allowRetake: boolean('allow_retake').default(false),
  shuffleQuestions: boolean('shuffle_questions').default(true),
  shuffleOptions: boolean('shuffle_options').default(true),
  tabSwitchLimit: integer('tab_switch_limit').default(3),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const examQuestions = pgTable('exam_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  marksOverride: integer('marks_override'),
});

const examRelations = relations(exams, ({ one, many }) => ({
  subject: one(subjects, { fields: [exams.subjectId], references: [subjects.id] }),
  batch: one(batches, { fields: [exams.batchId], references: [batches.id] }),
  author: one(users, { fields: [exams.createdBy], references: [users.id] }),
  examQuestions: many(examQuestions),
}));

const examQuestionRelations = relations(examQuestions, ({ one }) => ({
  exam: one(exams, { fields: [examQuestions.examId], references: [exams.id] }),
  question: one(questions, { fields: [examQuestions.questionId], references: [questions.id] }),
}));

module.exports = { exams, examQuestions, examRelations, examQuestionRelations };
