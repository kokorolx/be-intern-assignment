import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().required().min(2).max(255).messages({
    'string.empty': 'Please provide first name',
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 255 characters',
  }),
  lastName: Joi.string().trim().required().min(2).max(255).messages({
    'string.empty': 'Please provide last name',
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 255 characters',
  }),
  email: Joi.string().required().lowercase().email().domain().max(255).messages({
    'string.empty': 'Please provide email address',
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email must not exceed 255 characters',
  }),
}).strict();

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(255).messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 255 characters',
  }),
  lastName: Joi.string().trim().min(2).max(255).messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 255 characters',
  }),
  email: Joi.string().lowercase().email().domain().max(255).messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email must not exceed 255 characters',
  }),
})
  .strict()
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const userIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'Please provide a valid user ID',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive',
    'any.required': 'Please provide user ID',
  }),
}).strict();

export const getUserFollowersSchema = Joi.object({
  params: userIdParamsSchema,
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).optional()
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100',
      }),
    offset: Joi.number().integer().min(0).optional()
      .messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset must be non-negative',
      }),
  }).strict(),
}).strict();

export const getUserActivitySchema = Joi.object({
  params: userIdParamsSchema,
  query: Joi.object({
    type: Joi.string().valid('post', 'like', 'follow').optional()
      .messages({
        'string.base': 'Activity type must be a string',
        'any.only': 'Activity type must be one of: post, like, follow',
      }),
    startDate: Joi.date().iso().optional()
      .messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format',
      }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
      .messages({
        'date.base': 'End date must be a valid date',
        'date.format': 'End date must be in ISO format',
        'date.min': 'End date must be greater than or equal to start date',
      }),
    limit: Joi.number().integer().min(1).max(100).optional().default(10)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100',
      }),
    offset: Joi.number().integer().min(0).optional().default(0)
      .messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset must be non-negative',
      }),
  }).strict(),
}).strict();
