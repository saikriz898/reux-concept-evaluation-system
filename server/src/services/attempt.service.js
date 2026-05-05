const { db } = require('../config/db');
const { attempts, responses, exams } = require('../db/schema');
const { eq, and } = require('drizzle-orm');
const { ApiError } = require('../utils/apiError');

const startAttempt = async (studentId, examId, ipAddress) => {
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId)
  });

  if (!exam) throw new ApiError(404, 'Exam not found');
  
  const now = new Date();
  if (now < exam.startTime || now > exam.endTime) {
    throw new ApiError(400, 'Exam is not active');
  }

  const existingAttempt = await db.query.attempts.findFirst({
    where: and(
      eq(attempts.studentId, studentId),
      eq(attempts.examId, examId)
    )
  });

  if (existingAttempt && !exam.allowRetake) {
    throw new ApiError(400, 'Attempt already exists');
  }

  const [newAttempt] = await db.insert(attempts).values({
    studentId,
    examId,
    ipAddress,
    status: 'started'
  }).returning();

  return newAttempt;
};

const submitAttempt = async (attemptId, studentResponses) => {
  const attempt = await db.query.attempts.findFirst({
    where: eq(attempts.id, attemptId)
  });

  if (!attempt) throw new ApiError(404, 'Attempt not found');
  if (attempt.status !== 'started') throw new ApiError(400, 'Attempt already submitted');

  // Insert responses
  const responseValues = studentResponses.map(r => ({
    attemptId,
    questionId: r.questionId,
    responseType: r.type,
    selectedOptionId: r.selectedOptionId,
    explanationText: r.explanationText,
    codeText: r.codeText,
    timeSpentSeconds: r.timeSpent
  }));

  const insertedResponses = await db.insert(responses).values(responseValues).returning();

  await db.update(attempts)
    .set({
      status: 'submitted',
      submittedAt: new Date()
    })
    .where(eq(attempts.id, attemptId));

  const evaluationService = require('./evaluation.service');
  evaluationService.evaluateAttempt(attemptId); // Run in background

  return { message: 'Attempt submitted successfully' };
};

module.exports = { startAttempt, submitAttempt };
