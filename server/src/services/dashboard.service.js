const { db } = require('../config/db');
const { attempts, users, questions, exams, evaluationResults, weakConcepts } = require('../db/schema');
const { eq, avg, count, desc } = require('drizzle-orm');

const getStudentDashboard = async (studentId) => {
  const totalExams = await db.select({ count: count() })
    .from(attempts)
    .where(eq(attempts.studentId, studentId));

  const avgScore = await db.select({ avg: avg(evaluationResults.overallScore) })
    .from(evaluationResults)
    .innerJoin(attempts, eq(evaluationResults.attemptId, attempts.id))
    .where(eq(attempts.studentId, studentId));

  const recentAttempts = await db.query.attempts.findMany({
    where: eq(attempts.studentId, studentId),
    with: {
      exam: true
    },
    limit: 5,
    orderBy: [desc(attempts.createdAt)]
  });

  const weakAreas = await db.query.weakConcepts.findMany({
    where: eq(weakConcepts.studentId, studentId),
    limit: 5,
    orderBy: [desc(weakConcepts.avgScore)]
  });

  return {
    totalExamsAttempted: totalExams[0]?.count || 0,
    averageScore: parseFloat(avgScore[0]?.avg || 0).toFixed(2),
    recentAttempts,
    weakConcepts: weakAreas
  };
};

const getTeacherDashboard = async (teacherId) => {
  const totalStudents = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
  const totalExams = await db.select({ count: count() }).from(exams);
  const totalQuestions = await db.select({ count: count() }).from(questions);

  return {
    totalStudents: totalStudents[0]?.count || 0,
    totalExams: totalExams[0]?.count || 0,
    totalQuestions: totalQuestions[0]?.count || 0,
  };
};

module.exports = { getStudentDashboard, getTeacherDashboard };
