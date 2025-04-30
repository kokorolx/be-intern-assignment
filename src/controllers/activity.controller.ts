import { Request, Response } from 'express';
import { ActivityService, GetActivityOptions } from '../services/activity.service';

export class ActivityController {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  /**
   * Get a user's activity history with pagination and filters
   * @route GET /api/users/:id/activity
   * @param req Express request object with parameters and query:
   *    - id (number): User ID whose activity to fetch
   *    - type (string, optional): Filter by activity type ('post', 'like', 'follow')
   *    - startDate (string, optional): ISO date string for start of date range
   *    - endDate (string, optional): ISO date string for end of date range
   *    - limit (number, optional): Number of activities per page (default: 10)
   *    - offset (number, optional): Number of activities to skip (default: 0)
   * @param res Express response object
   * @returns {Promise<void>} JSON response with:
   *    - activities: Array of activity objects
   *    - totalCount: Total number of activities matching the filters
   * @throws {400} Invalid user ID format
   * @throws {500} Server error while fetching activities
   */
  async getUserActivity(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }

      const options: GetActivityOptions = {
        type: req.query.type as 'post' | 'like' | 'follow' | undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0
      };

      const { activities, totalCount } = await this.activityService.getUserActivity(userId, options);

      res.json({
        success: true,
        data: activities,
        metadata: {
          totalCount
        }
      });
    } catch (error) {
      console.error('Error in getUserActivity:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching user activities'
      });
    }
  }
}