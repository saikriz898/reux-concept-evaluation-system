const { pgTable, uuid, text, varchar, integer, timestamp, pgEnum, jsonb } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const { subjects, topics } = require('./academic');
const { users } = require('./users');

const questionTypeEnum = pgEnum('question_type', ['mcq', 'explanation', 'code']);
const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
const questionStatusEnum = pgEnum('question_status', ['draft', 'review', 'published']);

const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'cascade' }),
  createdBy: uuid('created_by').references(() => users.id),
  type: questionTypeEnum('type').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  questionText: text('question_text').notNull(),
  imageUrl: text('image_url'),
  options: jsonb('options'), // [{id, text, is_correct}]
  correctOptionId: varchar('correct_option_id', { length: 50 }),
  expectedKeywords: text('expected_keywords').array(),
  conceptTags: text('concept_tags').array(),
  marks: integer('marks').default(10),
  status: questionStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const questionRelations = relations(questions, ({ one }) => ({
  subject: one(subjects, { fields: [questions.subjectId], references: [subjects.id] }),
  topic: one(topics, { fields: [questions.topicId], references: [topics.id] }),
  author: one(users, { fields: [questions.createdBy], references: [users.id] }),
}));

module.exports = { questions, questionTypeEnum, difficultyEnum, questionStatusEnum, questionRelations };
