const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.userId)
  });
  res.status(200).json(user);
}));

router.get('/all', verifyToken, authorize('admin', 'teacher'), asyncHandler(async (req, res) => {
  const allUsers = await db.query.users.findMany();
  res.status(200).json(allUsers);
}));

module.exports = router;
