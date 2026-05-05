const { db } = require('../config/db');
const { questions } = require('../db/schema');
const { eq, ilike, and, or } = require('drizzle-orm');

const getQuestions = async (filters = {}) => {
  const { subjectId, topicId, type, difficulty, status, search } = filters;

  const whereConditions = [];
  if (subjectId) whereConditions.push(eq(questions.subjectId, subjectId));
  if (topicId) whereConditions.push(eq(questions.topicId, topicId));
  if (type) whereConditions.push(eq(questions.type, type));
  if (difficulty) whereConditions.push(eq(questions.difficulty, difficulty));
  if (status) whereConditions.push(eq(questions.status, status));
  if (search) whereConditions.push(ilike(questions.questionText, `%${search}%`));

  return await db.query.questions.findMany({
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    with: {
      subject: true,
      topic: true
    },
    orderBy: (questions, { desc }) => [desc(questions.createdAt)]
  });
};

const createQuestion = async (data) => {
  const [newQuestion] = await db.insert(questions).values(data).returning();
  return newQuestion;
};

module.exports = { getQuestions, createQuestion };
