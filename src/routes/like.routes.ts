import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validation.middleware';
import { createLikeSchema, likeIdParamsSchema } from '../validations/like.validation';
import { LikeController } from '../controllers/like.controller';

export const likeRouter = Router();
const likeController = new LikeController();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Apply rate limiting to all routes
likeRouter.use(limiter);

// Helper to convert async controller methods to express middleware
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

// Get likes with optional filtering by userId or postId
// Responses: 200 (OK), 400 (Invalid Query Params), 429 (Too Many Requests), 500 (Error)
likeRouter.get('/', asyncHandler((req, res) => likeController.getLikes(req, res)));

// Get like by id
// Responses: 200 (OK), 400 (Invalid ID), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
likeRouter.get('/:id',
  validate(likeIdParamsSchema, 'params') as RequestHandler,
  asyncHandler((req, res) => likeController.getLikeById(req, res))
);

// Create new like
// Responses: 201 (Created), 400 (Validation Error), 409 (Already Liked), 429 (Too Many Requests), 500 (Error)
likeRouter.post('/',
  validate(createLikeSchema) as RequestHandler,
  asyncHandler((req, res) => likeController.createLike(req, res))
);

// Delete like
// Responses: 204 (No Content), 400 (Invalid ID), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
likeRouter.delete('/:id',
  validate(likeIdParamsSchema, 'params') as RequestHandler,
  asyncHandler((req, res) => likeController.deleteLike(req, res))
);