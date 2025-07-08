import express from 'express';
import { MistralAIClient } from '../services/mistralAI.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateAIRequest } from '../middleware/validation.js';

const router = express.Router();
const mistralClient = new MistralAIClient();

// Generate subject lines
router.post('/generate-subject-lines', authenticateToken, validateAIRequest, async (req, res) => {
  try {
    const { campaignType, targetAudience, tone, keywords, count = 5 } = req.body;

    const subjectLines = await mistralClient.generateSubjectLines({
      campaignType,
      targetAudience,
      tone,
      keywords,
      count
    });

    res.json({ subjectLines });

  } catch (error) {
    console.error('Subject line generation error:', error);
    res.status(500).json({ error: 'Failed to generate subject lines' });
  }
});

// Generate email content
router.post('/generate-content', authenticateToken, validateAIRequest, async (req, res) => {
  try {
    const { prompt, tone, contentType, maxLength = 1000 } = req.body;

    const content = await mistralClient.generateContent({
      prompt,
      tone,
      contentType,
      maxLength
    });

    res.json({ content });

  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Optimize email content
router.post('/optimize-content', authenticateToken, validateAIRequest, async (req, res) => {
  try {
    const { content, optimizationGoal, targetAudience } = req.body;

    const optimizedContent = await mistralClient.optimizeContent({
      content,
      optimizationGoal,
      targetAudience
    });

    res.json({ optimizedContent });

  } catch (error) {
    console.error('Content optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize content' });
  }
});

// Analyze email sentiment
router.post('/analyze-sentiment', authenticateToken, validateAIRequest, async (req, res) => {
  try {
    const { content } = req.body;

    const sentiment = await mistralClient.analyzeSentiment({ content });

    res.json({ sentiment });

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Generate A/B test variations
router.post('/generate-ab-variations', authenticateToken, validateAIRequest, async (req, res) => {
  try {
    const { originalContent, variationType, count = 3 } = req.body;

    const variations = await mistralClient.generateABVariations({
      originalContent,
      variationType,
      count
    });

    res.json({ variations });

  } catch (error) {
    console.error('A/B variation generation error:', error);
    res.status(500).json({ error: 'Failed to generate A/B variations' });
  }
});

export default router;