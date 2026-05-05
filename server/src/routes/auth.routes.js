const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['student', 'teacher', 'mentor', 'admin']).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}));

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  // In production, set refresh token in http-only cookie
  res.status(200).json(result);
}));

router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { userId, token, type } = req.body;
  const result = await authService.verifyOtp(userId, token, type);
  res.status(200).json(result);
}));

module.exports = router;
