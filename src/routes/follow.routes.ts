import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validation.middleware';
import { createFollowSchema, deleteFollowSchema } from '../validations/follow.validation';
import { FollowController } from '../controllers/follow.controller';

export const followRouter = Router();
const followController = new FollowController();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Apply rate limiting to all routes
followRouter.use(limiter);

// Helper to convert async controller methods to express middleware
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

// Create new follow relationship
// Responses: 201 (Created), 400 (Validation Error/Self Follow), 409 (Already Following), 429 (Too Many Requests), 500 (Error)
followRouter.post('/',
  validate(createFollowSchema) as RequestHandler,
  asyncHandler((req, res) => followController.createFollow(req, res))
);

// Get followers of a user with pagination
// Responses: 200 (OK), 400 (Invalid User ID), 429 (Too Many Requests), 500 (Error)
followRouter.get('/followers/:userId',
  asyncHandler((req, res) => followController.getFollowers(req, res))
);

// Get users that a user is following with pagination
// Responses: 200 (OK), 400 (Invalid User ID), 429 (Too Many Requests), 500 (Error)
followRouter.get('/following/:userId',
  asyncHandler((req, res) => followController.getFollowing(req, res))
);

// Delete follow relationship
// Responses: 204 (No Content), 400 (Validation Error), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
followRouter.delete('/',
  validate(deleteFollowSchema) as RequestHandler,
  asyncHandler((req, res) => followController.deleteFollow(req, res))
);