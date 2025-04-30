import { Request, Response } from 'express';
import { LikeService, CreateLikeDto, GetLikesOptions } from '../services/like.service';

export class LikeController {
  private likeService: LikeService;

  constructor() {
    this.likeService = new LikeService();
  }

  /**
   * Create a new like
   * @route POST /api/likes
   * @param req Express request object with body (CreateLikeDto):
   *    - userId (number): ID of the user creating the like
   *    - postId (number): ID of the post being liked
   * @param res Express response object
   * @returns {Promise<void>} JSON response with created like object
   * @throws {400} Invalid like data
   * @throws {409} User has already liked this post
   * @throws {500} Server error while creating like
   */
  async createLike(req: Request, res: Response) {
    try {
      const likeData = req.body as CreateLikeDto;
      const like = await this.likeService.createLike(likeData);
      res.status(201).json({
        success: true,
        data: like,
      });
    } catch (error) {
      console.error('Error in createLike:', error);
      if (error instanceof Error && error.message === 'User has already liked this post') {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while creating like',
      });
    }
  }

  /**
   * Get likes with optional filtering
   * @route GET /api/likes
   * @param req Express request object with query parameters:
   *    - userId (number, optional): Filter likes by user
   *    - postId (number, optional): Filter likes by post
   * @param res Express response object
   * @returns {Promise<void>} JSON response with array of like objects
   * @throws {400} Invalid filter parameters
   * @throws {500} Server error while fetching likes
   */
  async getLikes(req: Request, res: Response) {
    try {
      const options: GetLikesOptions = {};

      if (req.query.userId) {
        const userId = parseInt(req.query.userId as string, 10);
        if (isNaN(userId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid userId format',
          });
        }
        options.userId = userId;
      }

      if (req.query.postId) {
        const postId = parseInt(req.query.postId as string, 10);
        if (isNaN(postId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid postId format',
          });
        }
        options.postId = postId;
      }

      const likes = await this.likeService.getLikes(options);
      res.json({
        success: true,
        data: likes,
      });
    } catch (error) {
      console.error('Error in getLikes:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching likes',
      });
    }
  }

  /**
   * Get a like by its ID
   * @route GET /api/likes/:id
   * @param req Express request object with parameters:
   *    - id (number): Like ID
   * @param res Express response object
   * @returns {Promise<void>} JSON response with like object
   * @throws {400} Invalid like ID format
   * @throws {404} Like not found
   * @throws {500} Server error while fetching like
   */
  async getLikeById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid like ID format',
        });
      }

      const like = await this.likeService.getLikeById(id);
      if (!like) {
        return res.status(404).json({
          success: false,
          message: 'Like not found',
        });
      }

      res.json({
        success: true,
        data: like,
      });
    } catch (error) {
      console.error('Error in getLikeById:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching like',
      });
    }
  }

  /**
   * Delete a like
   * @route DELETE /api/likes/:id
   * @param req Express request object with parameters:
   *    - id (number): Like ID
   * @param res Express response object
   * @returns {Promise<void>} Empty response with 204 status on success
   * @throws {400} Invalid like ID format
   * @throws {404} Like not found
   * @throws {500} Server error while deleting like
   */
  async deleteLike(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid like ID format',
        });
      }

      const deleted = await this.likeService.deleteLike(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Like not found',
        });
      }

      res.status(204).json({
        success: true,
        data: null,
      });
    } catch (error) {
      console.error('Error in deleteLike:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while deleting like',
      });
    }
  }
}