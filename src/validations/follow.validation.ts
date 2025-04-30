import Joi from 'joi';

/**
 * Validation schema for creating a follow relationship.
 * Ensures both followerId and followingId are provided and are positive integers.
 * Prevents self-following by ensuring followerId is not equal to followingId.
 */
export const createFollowSchema = Joi.object({
  followerId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'followerId must be a number',
      'number.integer': 'followerId must be an integer',
      'number.positive': 'followerId must be positive',
      'any.required': 'followerId is required',
    }),
  followingId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'followingId must be a number',
      'number.integer': 'followingId must be an integer',
      'number.positive': 'followingId must be positive',
      'any.required': 'followingId is required',
    }),
}).custom((value, helpers) => {
  if (value.followerId === value.followingId) {
    return helpers.error('custom.selfFollow', { message: 'Users cannot follow themselves' });
  }
  return value;
});

/**
 * Validation schema for follow ID in route parameters.
 * Ensures the ID is a positive integer.
 */
export const followIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Follow ID must be a number',
      'number.integer': 'Follow ID must be an integer',
      'number.positive': 'Follow ID must be positive',
      'any.required': 'Follow ID is required',
    }),
});

/**
 * Validation schema for deleting a follow relationship by user IDs.
 * Ensures both followerId and followingId are provided and are positive integers.
 */
export const deleteFollowSchema = Joi.object({
  followerId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'followerId must be a number',
      'number.integer': 'followerId must be an integer',
      'number.positive': 'followerId must be positive',
      'any.required': 'followerId is required',
    }),
  followingId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'followingId must be a number',
      'number.integer': 'followingId must be an integer',
      'number.positive': 'followingId must be positive',
      'any.required': 'followingId is required',
    }),
});