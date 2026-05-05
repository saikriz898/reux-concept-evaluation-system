const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../config/db');
const { responses, evaluationResults, attempts, weakConcepts } = require('../db/schema');
const { eq, and } = require('drizzle-orm');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class EvaluationService {
  /**
   * Orchestrate evaluation for an entire attempt
   */
  async evaluateAttempt(attemptId) {
    try {
      const attemptData = await db.query.attempts.findFirst({
        where: eq(attempts.id, attemptId),
        with: {
          responses: {
            with: {
              question: true
            }
          }
        }
      });

      if (!attemptData) return;

      for (const response of attemptData.responses) {
        if (response.responseType === 'mcq') {
          await this.evaluateMCQ(response);
        } else {
          await this.evaluateSubjective(response, attemptData.studentId);
        }
      }

      // Update attempt status
      await db.update(attempts)
        .set({ status: 'evaluated' })
        .where(eq(attempts.id, attemptId));
    } catch (error) {
      console.error('Orchestration Error:', error);
    }
  }

  async evaluateMCQ(response) {
    try {
      const isCorrect = response.selectedOptionId === response.question.correctOptionId;
      const score = isCorrect ? response.question.marks : 0;

      await db.insert(evaluationResults).values({
        responseId: response.id,
        attemptId: response.attemptId,
        evaluatedBy: 'ai',
        overallScore: score,
        maxMarks: response.question.marks,
        feedback: isCorrect ? 'Correct answer.' : `Incorrect answer.`,
      });
    } catch (error) {
      console.error('MCQ Evaluation Error:', error);
    }
  }

  async evaluateSubjective(response, studentId) {
    const prompt = `
      You are an elite academic evaluator at Sri College of Engineering. 
      Your task is to provide a high-fidelity, rigorous evaluation of a student's technical response.
      
      Question: ${response.question.questionText}
      Student Response: ${response.explanationText || response.codeText}
      Expected Technical Keywords: ${response.question.expectedKeywords?.join(', ')}
      Max Marks: ${response.question.marks}

      CRITICAL EVALUATION CRITERIA:
      1. Keyword Accuracy: Check if the student used technical terms correctly.
      2. Conceptual Depth: Does the response explain the "why" and "how", or just state facts?
      3. Reasoning: Is there a logical flow in the explanation?
      4. Engineering Standards: Does the response meet the technical rigor expected at an engineering college?

      MARKING INSTRUCTIONS:
      - Distribute the ${response.question.marks} marks across the categories below.
      - DO NOT give perfect marks unless the answer is flawless.
      - If the student has just copied parts of the question, give a score of 0.

      Provide a structured evaluation in JSON format:
      {
        "understanding_score": (0 to 30),
        "reasoning_score": (0 to 25),
        "depth_score": (0 to 20),
        "correctness_score": (0 to 15),
        "originality_score": (0 to 10),
        "overall_score": (A realistic total out of ${response.question.marks}),
        "feedback": "Detailed constructive feedback",
        "weak_concepts": ["concept1", "concept2"]
      }

      Respond ONLY with the JSON object. Respond in JSON format.
    `;

    try {
      const resultGen = await model.generateContent(prompt);
      const resText = resultGen.response.text();
      const cleanedJson = resText.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanedJson);

      await db.insert(evaluationResults).values({
        responseId: response.id,
        attemptId: response.attemptId,
        evaluatedBy: 'ai',
        understandingScore: Math.round(result.understanding_score || 0),
        reasoningScore: Math.round(result.reasoning_score || 0),
        depthScore: Math.round(result.depth_score || 0),
        correctnessScore: Math.round(result.correctness_score || 0),
        originalityScore: Math.round(result.originality_score || 0),
        overallScore: Math.round(result.overall_score || 0),
        maxMarks: response.question.marks,
        feedback: result.feedback,
        aiRawResponse: result,
      });

      // Update weak concepts
      if (result.weak_concepts && result.weak_concepts.length > 0) {
        for (const concept of result.weak_concepts) {
          const existing = await db.query.weakConcepts.findFirst({
            where: and(
              eq(weakConcepts.studentId, studentId),
              eq(weakConcepts.conceptTag, concept)
            )
          });

          if (existing) {
            await db.update(weakConcepts)
              .set({ 
                occurrenceCount: existing.occurrenceCount + 1,
                lastSeenAt: new Date()
              })
              .where(eq(weakConcepts.id, existing.id));
          } else {
            await db.insert(weakConcepts).values({
              studentId: studentId,
              subjectId: response.question.subjectId,
              conceptTag: concept,
              avgScore: result.overall_score
            });
          }
        }
      }

    } catch (error) {
      console.error('Gemini Evaluation Error:', error);
    }
  }
}

module.exports = new EvaluationService();
