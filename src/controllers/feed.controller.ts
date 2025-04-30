import { Request, Response } from 'express';
import { feedService } from '../services/feed.service';
import { AppError } from '../utils/AppError';

/**
 * Get the personalized feed for a user
 * @param req Request object containing userId query parameter and pagination options
 * @param res Response object
 */
export const getUserFeed = async (req: Request, res: Response): Promise<void> => {
  const { userId, limit, offset } = req.query;

  // Parse pagination parameters
  const parsedLimit = limit ? parseInt(limit as string, 10) : 10;
  const parsedOffset = offset ? parseInt(offset as string, 10) : 0;
  const parsedUserId = parseInt(userId as string, 10);

  // Get user's feed from service
  const feed = await feedService.getUserFeed(parsedUserId, {
    limit: parsedLimit,
    offset: parsedOffset,
  });

  // Send response
  res.json({
    success: true,
    data: feed,
  });
};