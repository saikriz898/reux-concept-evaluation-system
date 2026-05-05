const express = require('express');
const router = express.Router();
const attemptService = require('../services/attempt.service');
const { db } = require('../config/db');
const { attempts, exams, evaluationResults } = require('../db/schema');
const { eq, desc, sum } = require('drizzle-orm');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/exam/:examId', verifyToken, authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  const examAttempts = await db.query.attempts.findMany({
    where: eq(attempts.examId, req.params.examId),
    with: {
      student: true,
      responses: {
        with: {
          evaluationResult: true
        }
      }
    },
    orderBy: [desc(attempts.submittedAt)]
  });

  const processed = examAttempts.map(a => {
    const totalScore = a.responses.reduce((acc, r) => acc + (r.evaluationResult?.overallScore || 0), 0);
    const totalMaxMarks = a.responses.reduce((acc, r) => acc + (r.evaluationResult?.maxMarks || 0), 0);
    return {
      ...a,
      totalScore,
      totalMaxMarks
    };
  });

  res.status(200).json(processed);
}));

router.get('/results', verifyToken, asyncHandler(async (req, res) => {
  const userResults = await db.query.attempts.findMany({
    where: eq(attempts.studentId, req.user.userId),
    with: {
      exam: {
        with: {
          subject: true
        }
      },
      responses: {
        with: {
          evaluationResult: true
        }
      }
    },
    orderBy: [desc(attempts.submittedAt)]
  });

  // Calculate totals
  const processed = userResults.map(a => {
    const totalScore = a.responses.reduce((acc, r) => acc + (r.evaluationResult?.overallScore || 0), 0);
    const totalMaxMarks = a.responses.reduce((acc, r) => acc + (r.evaluationResult?.maxMarks || 10), 0);
    return {
      ...a,
      totalScore,
      totalMaxMarks
    };
  });

  res.status(200).json(processed);
}));

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const attempt = await db.query.attempts.findFirst({
    where: eq(attempts.id, req.params.id),
    with: {
      exam: {
        with: {
          subject: true
        }
      },
      responses: {
        with: {
          question: true,
          evaluationResult: true
        }
      }
    }
  });

  if (!attempt) throw new ApiError(404, 'Attempt not found');

  const totalScore = attempt.responses.reduce((acc, r) => acc + (r.evaluationResult?.overallScore || 0), 0);
  const totalMaxMarks = attempt.responses.reduce((acc, r) => acc + (r.evaluationResult?.maxMarks || 0), 0);

  res.status(200).json({
    ...attempt,
    totalScore,
    totalMaxMarks
  });
}));

router.post('/start', verifyToken, asyncHandler(async (req, res) => {
  const { examId } = req.body;
  const ipAddress = req.ip;
  const attempt = await attemptService.startAttempt(req.user.userId, examId, ipAddress);
  res.status(201).json(attempt);
}));

router.post('/submit', verifyToken, asyncHandler(async (req, res) => {
  const { attemptId, responses } = req.body;
  const result = await attemptService.submitAttempt(attemptId, responses);
  res.status(200).json(result);
}));

router.post('/response', verifyToken, asyncHandler(async (req, res) => {
  const { attemptId, response } = req.body;
  const result = await attemptService.saveResponse(attemptId, response);
  res.status(200).json(result);
}));

router.post('/practice/start', verifyToken, asyncHandler(async (req, res) => {
  const { mode, concept } = req.body;
  const attempt = await attemptService.startPracticeAttempt(req.user.userId, mode, concept);
  res.status(201).json(attempt);
}));

module.exports = router;
