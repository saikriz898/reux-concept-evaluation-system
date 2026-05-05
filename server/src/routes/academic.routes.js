const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { departments, subjects, batches } = require('../db/schema');
const { verifyToken } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

router.get('/departments', verifyToken, asyncHandler(async (req, res) => {
  const deps = await db.query.departments.findMany();
  res.status(200).json(deps);
}));

router.get('/subjects', verifyToken, asyncHandler(async (req, res) => {
  const subs = await db.query.subjects.findMany();
  res.status(200).json(subs);
}));

router.get('/batches', verifyToken, asyncHandler(async (req, res) => {
  const allBatches = await db.query.batches.findMany();
  res.status(200).json(allBatches);
}));

module.exports = router;
