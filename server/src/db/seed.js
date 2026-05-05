const { db } = require('../config/db');
const { 
  users, 
  departments, 
  subjects, 
  topics, 
  questions, 
  exams, 
  examQuestions,
  batches,
  enrollments
} = require('./schema');
const { hashPassword } = require('../utils/hash');

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Create Admin
    const adminPassword = await hashPassword('Admin@123');
    const [admin] = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@reux.app',
      passwordHash: adminPassword,
      role: 'admin',
      isVerified: true
    }).returning();

    // 2. Create Teachers
    const teacherPassword = await hashPassword('Teacher@123');
    const [teacher1] = await db.insert(users).values({
      name: 'Dr. Sarah Wilson',
      email: 'teacher1@reux.app',
      passwordHash: teacherPassword,
      role: 'teacher',
      isVerified: true
    }).returning();

    // 3. Departments
    const [cse] = await db.insert(departments).values({
      name: 'Computer Science & Engineering',
      code: 'CSE'
    }).returning();

    // 4. Batches
    const [batch1] = await db.insert(batches).values({
      departmentId: cse.id,
      name: '2022-2026',
      section: 'A',
      semester: 4,
      academicYear: '2024-25'
    }).returning();

    // 5. Subjects
    const [dsa] = await db.insert(subjects).values({
      departmentId: cse.id,
      name: 'Data Structures & Algorithms',
      code: 'CS401',
      semester: 4,
      credits: 4
    }).returning();

    // 6. Topics
    const [recursion] = await db.insert(topics).values({
      subjectId: dsa.id,
      name: 'Recursion',
      conceptTags: ['recursion', 'backtracking', 'stack'],
      orderIndex: 1
    }).returning();

    // 7. Questions
    const [q1] = await db.insert(questions).values({
      subjectId: dsa.id,
      topicId: recursion.id,
      createdBy: teacher1.id,
      type: 'explanation',
      difficulty: 'medium',
      questionText: 'Explain the concept of stack overflow in recursive functions and how to prevent it.',
      expectedKeywords: ['stack overflow', 'base case', 'recursion depth', 'memory'],
      conceptTags: ['recursion', 'memory-management'],
      marks: 10,
      status: 'published'
    }).returning();

    const [q2] = await db.insert(questions).values({
      subjectId: dsa.id,
      topicId: recursion.id,
      createdBy: teacher1.id,
      type: 'mcq',
      difficulty: 'easy',
      questionText: 'What is the base case in a recursive function?',
      options: [
        { id: 'a', text: 'The case that calls the function again', is_correct: false },
        { id: 'b', text: 'The condition that stops the recursion', is_correct: true },
        { id: 'c', text: 'The largest possible input', is_correct: false },
        { id: 'd', text: 'The first line of the function', is_correct: false }
      ],
      correctOptionId: 'b',
      conceptTags: ['recursion'],
      marks: 5,
      status: 'published'
    }).returning();

    // 8. Exam
    const [exam1] = await db.insert(exams).values({
      title: 'Unit 1: Recursion Mastery',
      subjectId: dsa.id,
      batchId: batch1.id,
      createdBy: teacher1.id,
      totalMarks: 15,
      durationMinutes: 30,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isPublished: true,
      instructions: 'Answer all questions. Do not switch tabs.'
    }).returning();

    // 9. Student & Enrollment
    const studentPassword = await hashPassword('Student@123');
    const [student] = await db.insert(users).values({
      name: 'John Student',
      email: 'student@reux.app',
      passwordHash: studentPassword,
      role: 'student',
      isVerified: true
    }).returning();

    await db.insert(enrollments).values({
      studentId: student.id,
      batchId: batch1.id
    });

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seed();
