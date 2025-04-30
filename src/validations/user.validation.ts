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
