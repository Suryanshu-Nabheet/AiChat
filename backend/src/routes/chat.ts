import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AIService } from '../services/aiService.js';
import { sanitizeInput, validateApiKey } from '../utils/security.js';
import { chatLimiter } from '../utils/rateLimiter.js';
import type { Request, Response } from 'express';

const router = Router();

// Validation rules
const chatValidation = [
  body('messages').isArray().withMessage('Messages must be an array'),
  body('messages.*.role').isIn(['user', 'assistant']).withMessage('Invalid message role'),
  body('messages.*.content').isString().trim().notEmpty().withMessage('Message content is required'),
  body('messages.*.content').isLength({ max: 10000 }).withMessage('Message too long'),
  body('config.provider').isIn(['openrouter', 'openai', 'anthropic', 'google']).withMessage('Invalid provider'),
  body('config.apiKey').isString().notEmpty().withMessage('API key is required'),
  body('config.modelId').isString().notEmpty().withMessage('Model ID is required'),
];

router.post(
  '/message',
  chatLimiter,
  chatValidation,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { messages, config } = req.body;

      // Sanitize all message content
      const sanitizedMessages = messages.map((msg: any) => ({
        ...msg,
        content: sanitizeInput(msg.content),
      }));

      // Validate API key format
      if (!validateApiKey(config.apiKey)) {
        return res.status(400).json({ error: 'Invalid API key format' });
      }

      // Call AI service
      const response = await AIService.sendMessage({
        messages: sanitizedMessages,
        config: {
          provider: config.provider,
          apiKey: config.apiKey,
          modelId: config.modelId,
        },
      });

      if (response.error) {
        return res.status(400).json({ error: response.error });
      }

      res.json({ content: response.content });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;

