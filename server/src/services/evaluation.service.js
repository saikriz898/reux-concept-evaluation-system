const Groq = require('groq-sdk');
const { db } = require('../config/db');
const { responses, evaluationResults, attempts, weakConcepts } = require('../db/schema');
const { eq, and } = require('drizzle-orm');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class EvaluationService {
  /**
   * Orchestrate evaluation for an entire attempt
   */
  async evaluateAttempt(attemptId) {
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
        await this.evaluateSubjective(response);
      }
    }

    // Update attempt status
    await db.update(attempts)
      .set({ status: 'evaluated' })
      .where(eq(attempts.id, attemptId));
  }

  async evaluateMCQ(response) {
    const isCorrect = response.selectedOptionId === response.question.correctOptionId;
    const score = isCorrect ? response.question.marks : 0;

    await db.insert(evaluationResults).values({
      responseId: response.id,
      attemptId: response.attemptId,
      evaluatedBy: 'ai',
      overallScore: score,
      maxMarks: response.question.marks,
      feedback: isCorrect ? 'Correct answer.' : `Incorrect. The correct answer was ${response.question.correctOptionId}.`,
    });
  }

  async evaluateSubjective(response) {
    const prompt = `
      You are an expert academic evaluator for Sri College of Engineering. 
      Evaluate the following student response based on conceptual understanding and reasoning.
      
      Question: ${response.question.questionText}
      Student Response: ${response.explanationText || response.codeText}
      Expected Keywords: ${response.question.expectedKeywords?.join(', ')}
      Max Marks: ${response.question.marks}

      Provide a structured evaluation in JSON format with the following fields:
      - understanding_score (0 to 30)
      - reasoning_score (0 to 25)
      - depth_score (0 to 20)
      - correctness_score (0 to 15)
      - originality_score (0 to 10)
      - overall_score (calculated out of ${response.question.marks})
      - feedback (detailed constructive feedback)
      - weak_concepts (array of strings identifying specific missing concepts)

      Respond ONLY with the JSON object.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional academic evaluator. Always respond in valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-70b-8192",
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content);

      await db.insert(evaluationResults).values({
        responseId: response.id,
        attemptId: response.attemptId,
        evaluatedBy: 'ai',
        understandingScore: result.understanding_score,
        reasoningScore: result.reasoning_score,
        depthScore: result.depth_score,
        correctnessScore: result.correctness_score,
        originalityScore: result.originality_score,
        overallScore: result.overall_score,
        maxMarks: response.question.marks,
        feedback: result.feedback,
        aiRawResponse: result,
      });

      // Update weak concepts
      if (result.weak_concepts && result.weak_concepts.length > 0) {
        for (const concept of result.weak_concepts) {
          // Check if already exists for student
          const existing = await db.query.weakConcepts.findFirst({
            where: and(
              eq(weakConcepts.studentId, response.studentId),
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
              studentId: response.studentId,
              subjectId: response.question.subjectId,
              conceptTag: concept,
              avgScore: result.overall_score
            });
          }
        }
      }

    } catch (error) {
      console.error('Groq Evaluation Error:', error);
    }
  }
}

module.exports = new EvaluationService();
