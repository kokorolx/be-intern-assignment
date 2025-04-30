import Joi from 'joi';

export const getFeedValidation = Joi.object({
  query: Joi.object({
    userId: Joi.number().integer().positive().required()
      .description('User ID to get feed for'),
    limit: Joi.number().integer().min(1).max(100).default(10)
      .description('Number of posts to return per page'),
    offset: Joi.number().integer().min(0).default(0)
      .description('Number of posts to skip for pagination'),
  }).required(),
}).required();