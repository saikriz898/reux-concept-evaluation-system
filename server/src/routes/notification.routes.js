const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { notifications } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { verifyToken } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const notes = await db.query.notifications.findMany({
    where: eq(notifications.userId, req.user.userId),
    orderBy: [desc(notifications.createdAt)]
  });
  res.status(200).json(notes);
}));

router.put('/:id/read', verifyToken, asyncHandler(async (req, res) => {
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, req.params.id));
  res.status(200).json({ message: 'Marked as read' });
}));

module.exports = router;
