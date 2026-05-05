const { db } = require('../config/db');
const { exams, examQuestions, questions } = require('../db/schema');
const { eq, and } = require('drizzle-orm');
const { ApiError } = require('../utils/apiError');

const createExam = async (examData, questionIds) => {
  console.log('Creating Exam with Data:', JSON.stringify(examData, null, 2));
  
  if (!examData.startTime || !examData.endTime) {
    throw new ApiError(400, 'Start time and End time are required');
  }

  const startDate = new Date(examData.startTime);
  const endDate = new Date(examData.endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new ApiError(400, 'Invalid date format for Start time or End time');
  }

  const formattedData = {
    ...examData,
    startTime: startDate,
    endTime: endDate,
  };

  const [newExam] = await db.insert(exams).values(formattedData).returning();

  if (questionIds && questionIds.length > 0) {
    const examQuestionValues = questionIds.map((id, index) => ({
      examId: newExam.id,
      questionId: id,
      orderIndex: index
    }));
    await db.insert(examQuestions).values(examQuestionValues);
  }

  return newExam;
};

const getExamForStudent = async (examId) => {
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      subject: true,
      examQuestions: {
        with: {
          question: true
        }
      }
    }
  });

  if (!exam) throw new ApiError(404, 'Exam not found');
  
  // Shuffle logic
  if (exam.shuffleQuestions) {
    exam.examQuestions.sort(() => Math.random() - 0.5);
  }

  return exam;
};

module.exports = { createExam, getExamForStudent };
