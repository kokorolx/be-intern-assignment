import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
  getUserFollowersSchema,
  getUserActivitySchema
} from '../validations/user.validation';
import { UserController } from '../controllers/user.controller';
import { ActivityController } from '../controllers/activity.controller';

export const userRouter = Router();
const userController = new UserController();
const activityController = new ActivityController();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Apply rate limiting to all routes
userRouter.use(limiter);

// Helper to convert async controller methods to express middleware
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

// Get all users
// Responses: 200 (OK), 429 (Too Many Requests), 500 (Error)
userRouter.get('/', asyncHandler((req, res) => userController.getAllUsers(req, res)));

// Get user by id
// Responses: 200 (OK), 400 (Invalid ID), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
userRouter.get('/:id',
  validate(userIdParamsSchema, 'params') as RequestHandler,
  asyncHandler((req, res) => userController.getUserById(req, res))
);

// Create new user
// Responses: 201 (Created), 400 (Validation Error), 409 (Email Already Exists), 429 (Too Many Requests), 500 (Error)
userRouter.post('/',
  validate(createUserSchema) as RequestHandler,
  asyncHandler((req, res) => userController.createUser(req, res))
);

// Get user activity history
// Responses: 200 (OK), 400 (Invalid ID/Validation Error), 429 (Too Many Requests), 500 (Error)
userRouter.get('/:id/activity',
  validate(getUserActivitySchema) as RequestHandler,
  asyncHandler((req, res) => activityController.getUserActivity(req, res))
);

// Update user
// Responses: 200 (OK), 400 (Invalid ID/Validation Error), 404 (Not Found), 409 (Email Already Exists), 429 (Too Many Requests), 500 (Error)
userRouter.put('/:id',
  validate(userIdParamsSchema, 'params') as RequestHandler,
  validate(updateUserSchema) as RequestHandler,
  asyncHandler((req, res) => userController.updateUser(req, res))
);

// Delete user
// Responses: 200 (OK), 400 (Invalid ID), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
userRouter.delete('/:id',
  validate(userIdParamsSchema, 'params') as RequestHandler,
  asyncHandler((req, res) => userController.deleteUser(req, res))
);

// Get user followers
// Responses: 200 (OK), 400 (Invalid ID/Validation Error), 429 (Too Many Requests), 500 (Error)
userRouter.get('/:id/followers',
  validate(getUserFollowersSchema) as RequestHandler,
  asyncHandler((req, res) => userController.getUserFollowers(req, res))
);
