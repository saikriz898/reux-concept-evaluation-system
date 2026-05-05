const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { verifyToken } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/chat', verifyToken, asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  const systemPrompt = `
    You are MindBridge AI, a specialized academic assistant for Sri College of Engineering.
    Your goal is to help students verify their doubts and understand complex concepts.
    
    RULES:
    1. DO NOT provide full code solutions for homework or exams.
    2. Focus on explaining logic, concepts, and pseudo-code.
    3. If a student asks for code, explain the algorithm and guide them to write it themselves.
    4. Be professional, encouraging, and academically rigorous.
    5. Keep responses concise and focused.
  `;

  try {
    const chat = model.startChat({
      history: (history || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      message: text
    });
  } catch (err) {
    console.error('Gemini AI Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'AI service is currently unavailable. Please check your API key.' 
    });
  }
}));

router.post('/generate-questions', verifyToken, asyncHandler(async (req, res) => {
  const { topic, difficulty } = req.body;

  const systemPrompt = `
    You are an AI academic question generator for Sri College of Engineering.
    Generate 3 high-quality questions based on the topic and difficulty provided.
    
    Response MUST be a valid JSON object containing a "questions" key which is an array of objects.
    Each question object must have:
    - type: "mcq" or "subjective"
    - questionText: string
    - options: array of 4 strings (only for mcq)
    - correctOptionIdx: number (0-3, only for mcq)
    - marks: number (based on difficulty)
    
    Respond ONLY with the JSON object.
  `;

  try {
    const prompt = `${systemPrompt}\n\nTopic: ${topic}\nDifficulty: ${difficulty}\n\nJSON:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up JSON if model includes markdown blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);
    const questions = data.questions || [];

    res.status(200).json({ questions });
  } catch (err) {
    console.error('Gemini AI Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate questions. AI service error.' 
    });
  }
}));

module.exports = router;
