import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().trim().required().messages({
    'string.empty': 'Please provide post content',
    'any.required': 'Post content is required',
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'Please provide a valid user ID',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required',
  }),
}).strict();

export const updatePostSchema = Joi.object({
  content: Joi.string().trim().required().messages({
    'string.empty': 'Please provide post content',
    'any.required': 'Post content is required',
  }),
}).strict();

export const postIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'Please provide a valid post ID',
    'number.integer': 'Post ID must be an integer',
    'number.positive': 'Post ID must be positive',
    'any.required': 'Please provide post ID',
  }),
}).strict();