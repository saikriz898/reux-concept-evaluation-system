const { pgTable, uuid, pgEnum, timestamp, integer, varchar, boolean, text, jsonb, decimal } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const { exams } = require('./exams');
const { users } = require('./users');
const { questions } = require('./questions');
const { subjects } = require('./academic');

const attemptStatusEnum = pgEnum('attempt_status', ['started', 'submitted', 'evaluated', 'flagged']);
const responseTypeEnum = pgEnum('response_type', ['mcq', 'explanation', 'code']);
const evaluatedByEnum = pgEnum('evaluated_by', ['ai', 'manual']);

const attempts = pgTable('attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }),
  status: attemptStatusEnum('status').default('started'),
  startedAt: timestamp('started_at').defaultNow(),
  submittedAt: timestamp('submitted_at'),
  timeSpentSeconds: integer('time_spent_seconds'),
  tabSwitchCount: integer('tab_switch_count').default(0),
  ipAddress: varchar('ip_address', { length: 45 }),
  isFlagged: boolean('is_flagged').default(false),
  flagReason: text('flag_reason'),
  createdAt: timestamp('created_at').defaultNow(),
});

const responses = pgTable('responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  attemptId: uuid('attempt_id').references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }),
  responseType: responseTypeEnum('response_type').notNull(),
  selectedOptionId: varchar('selected_option_id', { length: 50 }),
  explanationText: text('explanation_text'),
  codeText: text('code_text'),
  timeSpentSeconds: integer('time_spent_seconds'),
  createdAt: timestamp('created_at').defaultNow(),
});

const evaluationResults = pgTable('evaluation_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  responseId: uuid('response_id').references(() => responses.id, { onDelete: 'cascade' }),
  attemptId: uuid('attempt_id').references(() => attempts.id, { onDelete: 'cascade' }),
  evaluatedBy: evaluatedByEnum('evaluated_by').default('ai'),
  understandingScore: integer('understanding_score'),
  reasoningScore: integer('reasoning_score'),
  depthScore: integer('depth_score'),
  correctnessScore: integer('correctness_score'),
  originalityScore: integer('originality_score'),
  overallScore: integer('overall_score'),
  maxMarks: integer('max_marks'),
  feedback: text('feedback'),
  aiRawResponse: jsonb('ai_raw_response'),
  evaluatedAt: timestamp('evaluated_at').defaultNow(),
});

const weakConcepts = pgTable('weak_concepts', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  conceptTag: varchar('concept_tag', { length: 100 }).notNull(),
  avgScore: decimal('avg_score', { precision: 5, scale: 2 }),
  occurrenceCount: integer('occurrence_count').default(1),
  lastSeenAt: timestamp('last_seen_at').defaultNow(),
});

const questionSimilarities = pgTable('question_similarities', {
  id: uuid('id').primaryKey().defaultRandom(),
  attemptId1: uuid('attempt_id_1'),
  attemptId2: uuid('attempt_id_2'),
  responseId1: uuid('response_id_1').references(() => responses.id),
  responseId2: uuid('response_id_2').references(() => responses.id),
  similarityScore: decimal('similarity_score', { precision: 5, scale: 2 }),
  checkedAt: timestamp('checked_at').defaultNow(),
});

const attemptRelations = relations(attempts, ({ one, many }) => ({
  exam: one(exams, { fields: [attempts.examId], references: [exams.id] }),
  student: one(users, { fields: [attempts.studentId], references: [users.id] }),
  responses: many(responses),
}));

const responseRelations = relations(responses, ({ one }) => ({
  attempt: one(attempts, { fields: [responses.attemptId], references: [attempts.id] }),
  question: one(questions, { fields: [responses.questionId], references: [questions.id] }),
  evaluationResult: one(evaluationResults, { fields: [responses.id], references: [evaluationResults.responseId] }),
}));

module.exports = { 
  attempts, 
  responses, 
  evaluationResults, 
  weakConcepts, 
  questionSimilarities, 
  attemptStatusEnum, 
  responseTypeEnum, 
  evaluatedByEnum,
  attemptRelations, 
  responseRelations 
};
