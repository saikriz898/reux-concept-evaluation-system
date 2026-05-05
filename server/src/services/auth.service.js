const { db } = require('../config/db');
const { users, otpTokens } = require('../db/schema');
const { eq, and } = require('drizzle-orm');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { ApiError } = require('../utils/apiError');
const crypto = require('crypto');

const register = async (userData) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, userData.email)
  });

  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const hashedPassword = await hashPassword(userData.password);
  
  const [newUser] = await db.insert(users).values({
    name: userData.name,
    email: userData.email,
    passwordHash: hashedPassword,
    role: userData.role || 'student',
    isVerified: true
  }).returning();

  // Auto-enroll in first available batch if student
  if (newUser.role === 'student') {
    const { batches, enrollments } = require('../db/schema');
    const batch = await db.query.batches.findFirst();
    if (batch) {
      await db.insert(enrollments).values({
        studentId: newUser.id,
        batchId: batch.id
      });
    }
  }

  return { message: 'Registration successful. You can now login.' };
};

const login = async (email, password) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { 
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
};

const verifyOtp = async (userId, token, type) => {
  const otpRecord = await db.query.otpTokens.findFirst({
    where: and(
      eq(otpTokens.userId, userId),
      eq(otpTokens.token, token),
      eq(otpTokens.type, type),
      eq(otpTokens.isUsed, false)
    )
  });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  await db.update(otpTokens)
    .set({ isUsed: true })
    .where(eq(otpTokens.id, otpRecord.id));

  if (type === 'email_verify') {
    await db.update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId));
  }

  return { message: 'OTP verified successfully' };
};

module.exports = { register, login, verifyOtp };
