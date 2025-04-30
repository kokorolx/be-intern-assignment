import Joi from 'joi';

/**
 * Validation schema for creating a new hashtag.
 * Ensures tag is a required string, lowercase, with no spaces.
 */
export const createHashtagSchema = Joi.object({
  tag: Joi.string()
    .required()
    .lowercase()
    .pattern(/^[^\s]+$/)
    .messages({
      'string.pattern.base': 'Hashtag must not contain spaces',
      'string.empty': 'Hashtag is required',
      'any.required': 'Hashtag is required'
    })
});

/**
 * Validation schema for adding a hashtag to a post.
 * Can accept either a tag string or an existing hashtagId.
 */
export const addHashtagToPostSchema = Joi.object({
  postId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Post ID must be a number',
      'number.positive': 'Post ID must be positive',
      'any.required': 'Post ID is required'
    }),
  tag: Joi.string()
    .lowercase()
    .pattern(/^[^\s]+$/)
    .messages({
      'string.pattern.base': 'Hashtag must not contain spaces'
    }),
  hashtagId: Joi.number()
    .integer()
    .positive()
}).xor('tag', 'hashtagId').messages({
  'object.xor': 'Either tag or hashtagId must be provided, but not both'
});

/**
 * Validation schema for getting posts by hashtag.
 * Validates tag parameter and pagination options.
 */
export const getPostsByHashtagSchema = Joi.object({
  params: Joi.object({
    tag: Joi.string()
      .required()
      .messages({
        'string.empty': 'Tag is required',
        'any.required': 'Tag is required'
      })
  }),
  query: Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      }),
    offset: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset cannot be negative'
      })
  })
});