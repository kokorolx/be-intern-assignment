import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { HashtagService } from '../services/hashtag.service';
import { AppError } from '../utils/AppError';

export class HashtagController {
  private hashtagService: HashtagService;

  constructor(private dataSource: DataSource) {
    this.hashtagService = new HashtagService(dataSource);
  }

  /**
   * Add a hashtag to a post
   */
  async addHashtagToPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = parseInt(req.params.postId);
      const { tag, hashtagId } = req.body;

      const updatedPost = await this.hashtagService.addHashtagToPost(
        postId,
        hashtagId || tag
      );

      res.status(200).json({
        status: 'success',
        data: {
          post: updatedPost
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a hashtag from a post
   */
  async removeHashtagFromPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = parseInt(req.params.postId);
      const tag = req.params.tag;

      const updatedPost = await this.hashtagService.removeHashtagFromPost(postId, tag);

      res.status(200).json({
        status: 'success',
        data: {
          post: updatedPost
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get posts by hashtag
   */
  async getPostsByHashtag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tag } = req.params;
      const { offset = '0', limit = '10' } = req.query;

      const skip = parseInt(offset as string);
      const take = parseInt(limit as string);

      const { posts, total } = await this.hashtagService.getPostsByHashtag(tag, {
        skip,
        take
      });

      res.status(200).json({
        status: 'success',
        data: {
          posts,
          metadata: {
            total,
            offset: skip,
            limit: take
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}