const express = require('express');
const router = express.Router();
const questionService = require('../services/question.service');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const questions = await questionService.getQuestions(req.query);
  res.status(200).json(questions);
}));

router.post('/', verifyToken, authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  const newQuestion = await questionService.createQuestion({ ...req.body, createdBy: req.user.userId });
  res.status(201).json(newQuestion);
}));

module.exports = router;
