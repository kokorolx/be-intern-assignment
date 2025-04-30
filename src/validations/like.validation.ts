import Joi from 'joi';

/**
 * Validation schema for creating a like.
 * Ensures both userId and postId are provided and are positive integers.
 */
export const createLikeSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'userId must be a number',
      'number.integer': 'userId must be an integer',
      'number.positive': 'userId must be positive',
      'any.required': 'userId is required',
    }),
  postId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'postId must be a number',
      'number.integer': 'postId must be an integer',
      'number.positive': 'postId must be positive',
      'any.required': 'postId is required',
    }),
});

/**
 * Validation schema for like ID in route parameters.
 * Ensures the ID is a positive integer.
 */
export const likeIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Like ID must be a number',
      'number.integer': 'Like ID must be an integer',
      'number.positive': 'Like ID must be positive',
      'any.required': 'Like ID is required',
    }),
});