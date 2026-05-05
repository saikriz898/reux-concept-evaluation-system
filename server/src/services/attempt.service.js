const { db } = require('../config/db');
const { attempts, responses, exams, examQuestions } = require('../db/schema');
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

  if (existingAttempt) {
    if (existingAttempt.status === 'started') {
      return existingAttempt;
    }
    if (!exam.allowRetake) {
      throw new ApiError(400, 'Attempt already exists');
    }
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

  // Clear any existing responses (from auto-save) to avoid duplicates
  await db.delete(responses).where(eq(responses.attemptId, attemptId));

  // Insert final responses
  const responseValues = studentResponses.map(r => ({
    attemptId,
    questionId: r.questionId,
    responseType: r.type,
    selectedOptionId: r.selectedOptionId,
    explanationText: r.explanationText,
    codeText: r.codeText,
    timeSpentSeconds: r.timeSpent
  }));

  if (responseValues.length > 0) {
    await db.insert(responses).values(responseValues);
  }

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

const saveResponse = async (attemptId, r) => {
  const existing = await db.query.responses.findFirst({
    where: and(
      eq(responses.attemptId, attemptId),
      eq(responses.questionId, r.questionId)
    )
  });

  const responseData = {
    attemptId,
    questionId: r.questionId,
    responseType: r.type,
    selectedOptionId: r.selectedOptionId,
    explanationText: r.explanationText,
    codeText: r.codeText,
    timeSpentSeconds: r.timeSpent
  };

  if (existing) {
    await db.update(responses)
      .set(responseData)
      .where(eq(responses.id, existing.id));
  } else {
    await db.insert(responses).values(responseData);
  }

  return { success: true };
};

const startPracticeAttempt = async (studentId, mode, concept) => {
  // In a real app, this would fetch questions dynamically
  // For now, let's pick 10 random questions
  const allQuestions = await db.query.questions.findMany({
    limit: 10
  });

  if (allQuestions.length === 0) throw new ApiError(404, 'No questions found for practice');

  // Create a mock exam for this practice session
  const [practiceExam] = await db.insert(exams).values({
    title: `Practice: ${mode}`,
    description: `A personalized practice session for ${mode}`,
    durationMinutes: 30,
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24h
    createdBy: studentId,
    subjectId: allQuestions[0].subjectId,
    totalMarks: allQuestions.reduce((acc, q) => acc + (q.marks || 10), 0),
    isPublished: true
  }).returning();

  // Create the attempt
  const [attempt] = await db.insert(attempts).values({
    studentId,
    examId: practiceExam.id,
    status: 'started'
  }).returning();

  // Link questions to this mock exam
  for (let i = 0; i < allQuestions.length; i++) {
    const q = allQuestions[i];
    await db.insert(examQuestions).values({
      examId: practiceExam.id,
      questionId: q.id,
      marksOverride: q.marks,
      orderIndex: i
    });
  }

  return { id: attempt.id, examId: practiceExam.id };
};

module.exports = { startAttempt, submitAttempt, saveResponse, startPracticeAttempt };
