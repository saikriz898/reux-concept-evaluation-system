const express = require('express');
const router = express.Router();
const examService = require('../services/exam.service');
const { db } = require('../config/db');
const { exams, enrollments } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/', verifyToken, authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  try {
    const allExams = await db.query.exams.findMany({
      with: {
        subject: true
      },
      orderBy: (exams, { desc }) => [desc(exams.createdAt)]
    });
    res.status(200).json(allExams);
  } catch (error) {
    console.error('Exams Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
}));

router.post('/', verifyToken, authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  const { questionIds, ...examData } = req.body;
  const exam = await examService.createExam({ ...examData, createdBy: req.user.userId }, questionIds);
  res.status(201).json(exam);
}));

router.get('/student', verifyToken, asyncHandler(async (req, res) => {
  // Get student's batch first
  const enrollment = await db.query.enrollments.findFirst({
    where: eq(enrollments.studentId, req.user.userId)
  });

  if (!enrollment) return res.status(200).json([]);

  const studentExams = await db.query.exams.findMany({
    where: eq(exams.batchId, enrollment.batchId),
    with: {
      subject: true
    },
    orderBy: [desc(exams.startTime)]
  });

  // Add status helper
  const now = new Date();
  const result = studentExams.map(e => ({
    ...e,
    status: now > e.endTime ? 'closed' : now < e.startTime ? 'upcoming' : 'ongoing'
  }));

  res.status(200).json(result);
}));

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const exam = await examService.getExamForStudent(req.params.id);
  res.status(200).json(exam);
}));

module.exports = router;
