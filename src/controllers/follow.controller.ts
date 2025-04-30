import { Request, Response } from 'express';
import { FollowService, CreateFollowDto, GetFollowsOptions } from '../services/follow.service';

export class FollowController {
  private followService: FollowService;

  constructor() {
    this.followService = new FollowService();
  }

  /**
   * Create a new follow relationship
   * @route POST /api/follows
   * @param req Express request object with body (CreateFollowDto):
   *    - followerId (number): ID of the user who wants to follow
   *    - followingId (number): ID of the user to be followed
   * @param res Express response object
   * @returns {Promise<void>} JSON response with created follow object
   * @throws {400} Invalid follow data
   * @throws {409} Follow relationship already exists
   * @throws {500} Server error while creating follow
   */
  async createFollow(req: Request, res: Response) {
    try {
      const followData = req.body as CreateFollowDto;
      const follow = await this.followService.createFollow(followData);
      res.status(201).json({
        success: true,
        data: follow,
      });
    } catch (error) {
      console.error('Error in createFollow:', error);
      if (error instanceof Error) {
        if (error.message === 'Follow relationship already exists') {
          return res.status(409).json({
            success: false,
            message: error.message,
          });
        }
        if (error.message === 'Users cannot follow themselves') {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }
      }
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while creating follow relationship',
      });
    }
  }

  /**
   * Get followers of a user with pagination
   * @route GET /api/follows/followers/:userId
   * @param req Express request object with parameters and query:
   *    - userId (number): User ID whose followers to fetch
   *    - page (number, optional): Page number for pagination
   *    - limit (number, optional): Number of items per page
   * @param res Express response object
   * @returns {Promise<void>} JSON response with array of follow objects
   * @throws {400} Invalid user ID or pagination parameters
   * @throws {500} Server error while fetching followers
   */
  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format',
        });
      }

      const options: GetFollowsOptions = {
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const { followers, totalCount } = await this.followService.getFollowers(userId, options);
      res.json({
        success: true,
        data: followers,
        metadata: {
          totalCount,
        },
      });
    } catch (error) {
      console.error('Error in getFollowers:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching followers',
      });
    }
  }

  /**
   * Get users that a user is following with pagination
   * @route GET /api/follows/following/:userId
   * @param req Express request object with parameters and query:
   *    - userId (number): User ID whose following list to fetch
   *    - page (number, optional): Page number for pagination
   *    - limit (number, optional): Number of items per page
   * @param res Express response object
   * @returns {Promise<void>} JSON response with array of follow objects
   * @throws {400} Invalid user ID or pagination parameters
   * @throws {500} Server error while fetching following list
   */
  async getFollowing(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format',
        });
      }

      const options: GetFollowsOptions = {
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const following = await this.followService.getFollowing(userId, options);
      res.json({
        success: true,
        data: following,
      });
    } catch (error) {
      console.error('Error in getFollowing:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching following list',
      });
    }
  }

  /**
   * Delete a follow relationship by follower and following IDs
   * @route DELETE /api/follows
   * @param req Express request object with body:
   *    - followerId (number): ID of the follower
   *    - followingId (number): ID of the user being followed
   * @param res Express response object
   * @returns {Promise<void>} Empty response with 204 status on success
   * @throws {400} Invalid user IDs
   * @throws {404} Follow relationship not found
   * @throws {500} Server error while deleting follow
   */
  async deleteFollow(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;
      const deleted = await this.followService.deleteFollowByUsers(followerId, followingId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Follow relationship not found',
        });
      }

      res.status(204).json({
        success: true,
        data: null,
      });
    } catch (error) {
      console.error('Error in deleteFollow:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while deleting follow relationship',
      });
    }
  }
}