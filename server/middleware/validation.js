import Joi from 'joi';

export const validatePaymentRequest = (req, res, next) => {
  const schema = Joi.object({
    planId: Joi.string().valid('starter', 'professional', 'enterprise').required(),
    billingCycle: Joi.string().valid('monthly', 'yearly').required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP').default('USD')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateAIRequest = (req, res, next) => {
  const schema = Joi.object({
    campaignType: Joi.string().optional(),
    targetAudience: Joi.string().optional(),
    tone: Joi.string().optional(),
    keywords: Joi.array().items(Joi.string()).optional(),
    count: Joi.number().integer().min(1).max(10).optional(),
    prompt: Joi.string().optional(),
    contentType: Joi.string().optional(),
    maxLength: Joi.number().integer().min(100).max(5000).optional(),
    content: Joi.string().optional(),
    optimizationGoal: Joi.string().optional(),
    variationType: Joi.string().optional(),
    originalContent: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateCampaignRequest = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    subject: Joi.string().required(),
    content: Joi.string().required(),
    recipients: Joi.array().items(Joi.string().email()).required(),
    scheduled_for: Joi.date().iso().optional(),
    campaign_type: Joi.string().valid('promotional', 'newsletter', 'transactional').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};