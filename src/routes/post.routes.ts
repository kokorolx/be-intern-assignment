import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema, postIdParamsSchema } from '../validations/post.validation';
import { addHashtagToPostSchema } from '../validations/hashtag.validation';
import { PostController } from '../controllers/post.controller';
import { HashtagController } from '../controllers/hashtag.controller';
import { AppDataSource } from '../data-source';
import { getPostsByHashtagSchema } from '../validations/hashtag.validation';

export const postRouter = Router();
const postController = new PostController();
const hashtagController = new HashtagController(AppDataSource);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Apply rate limiting to all routes
postRouter.use(limiter);

// Helper to convert async controller methods to express middleware
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Get all posts
// Responses: 200 (OK), 429 (Too Many Requests), 500 (Error)
postRouter.get('/', asyncHandler((req, res, next) => postController.getPosts(req, res)));

// Get post by id
// Responses: 200 (OK), 400 (Invalid ID), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
postRouter.get('/:id',
  validate(postIdParamsSchema, 'params') as RequestHandler,
  asyncHandler((req, res, next) => postController.getPostById(req, res))
);

// Create new post
// Responses: 201 (Created), 400 (Validation Error), 429 (Too Many Requests), 500 (Error)
postRouter.post('/',
  validate(createPostSchema) as RequestHandler,
  asyncHandler((req, res, next) => postController.createPost(req, res))
);

// Update post
// Responses: 200 (OK), 400 (Invalid ID/Validation Error), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
postRouter.put('/:id',
  validate(postIdParamsSchema, 'params') as RequestHandler,
  validate(updatePostSchema) as RequestHandler,
  asyncHandler((req, res, next) => postController.updatePost(req, res))
);

// Delete post
// Responses: 204 (No Content), 400 (Invalid ID), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
postRouter.delete('/:id',
  validate(postIdParamsSchema, 'params') as RequestHandler,
  asyncHandler((req, res, next) => postController.deletePost(req, res))
);

// Add hashtag to post
// Responses: 200 (OK), 400 (Validation Error), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
postRouter.post('/:postId/hashtags',
  validate(addHashtagToPostSchema) as RequestHandler,
  asyncHandler((req: Request, res: Response, next: NextFunction) => hashtagController.addHashtagToPost(req, res, next))
);

// Remove hashtag from post
// Responses: 200 (OK), 400 (Validation Error), 404 (Not Found), 429 (Too Many Requests), 500 (Error)
postRouter.delete('/:postId/hashtags/:tag',
  asyncHandler((req: Request, res: Response, next: NextFunction) => hashtagController.removeHashtagFromPost(req, res, next))
);

// Get posts by hashtag
// Responses: 200 (OK), 400 (Validation Error), 429 (Too Many Requests), 500 (Error)
postRouter.get('/hashtag/:tag',
  validate(getPostsByHashtagSchema) as RequestHandler,
  asyncHandler((req: Request, res: Response, next: NextFunction) => hashtagController.getPostsByHashtag(req, res, next))
);