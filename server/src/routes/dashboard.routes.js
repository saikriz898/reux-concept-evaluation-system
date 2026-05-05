const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboard.service');
const { verifyToken } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/student', verifyToken, asyncHandler(async (req, res) => {
  const data = await dashboardService.getStudentDashboard(req.user.userId);
  res.status(200).json(data);
}));

router.get('/teacher', verifyToken, asyncHandler(async (req, res) => {
  const data = await dashboardService.getTeacherDashboard(req.user.userId);
  res.status(200).json(data);
}));

module.exports = router;
