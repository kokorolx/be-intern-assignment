import { Request, Response } from 'express';
import { UserService, CreateUserDto, UpdateUserDto } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get a paginated list of all users
   * @route GET /api/users
   * @param req Express request object with query parameters:
   *    - page (number, optional): Page number for pagination (default: 1)
   *    - limit (number, optional): Number of users per page (default: 10)
   * @param res Express response object
   * @returns {Promise<void>} JSON response with:
   *    - users: Array of user objects
   *    - total: Total number of users
   *    - page: Current page number
   *    - limit: Number of users per page
   * @throws {400} Invalid pagination parameters
   * @throws {500} Server error while fetching users
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      // Parse pagination parameters
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);

      // Validate pagination parameters
      if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page and limit must be positive integers'
        });
      }

      const result = await this.userService.getAllUsers({ page, limit });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching users'
      });
    }
  }

  /**
   * Get a user by their ID
   * @route GET /api/users/:id
   * @param req Express request object with parameters:
   *    - id (number): User ID
   * @param res Express response object
   * @returns {Promise<void>} JSON response with user object
   * @throws {400} Invalid user ID format
   * @throws {404} User not found
   * @throws {500} Server error while fetching user
   */
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching user'
      });
    }
  }

  /**
   * Create a new user
   * @route POST /api/users
   * @param req Express request object with body (CreateUserDto):
   *    - username (string): User's username
   *    - email (string): User's email address
   *    - password (string): User's password
   * @param res Express response object
   * @returns {Promise<void>} JSON response with created user object
   * @throws {400} Invalid user data
   * @throws {500} Server error while creating user
   */
  async createUser(req: Request, res: Response) {
    try {
      const userData = req.body as CreateUserDto;
      const user = await this.userService.createUser(userData);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while creating user'
      });
    }
  }

  /**
   * Update an existing user
   * @route PUT /api/users/:id
   * @param req Express request object with:
   *    - params.id (number): User ID
   *    - body (UpdateUserDto): Updated user data
   *        - username (string, optional): Updated username
   *        - email (string, optional): Updated email
   *        - password (string, optional): Updated password
   * @param res Express response object
   * @returns {Promise<void>} JSON response with updated user object
   * @throws {400} Invalid user ID format or invalid update data
   * @throws {404} User not found
   * @throws {500} Server error while updating user
   */
  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }

      const updateData = req.body as UpdateUserDto;
      const user = await this.userService.updateUser(id, updateData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while updating user'
      });
    }
  }

  /**
   * Delete a user
   * @route DELETE /api/users/:id
   * @param req Express request object with parameters:
   *    - id (number): User ID
   * @param res Express response object
   * @returns {Promise<void>} Empty response with 204 status on success
   * @throws {400} Invalid user ID format
   * @throws {404} User not found
   * @throws {500} Server error while deleting user
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }

      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(204).json({
        success: true,
        data: null
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while deleting user'
      });
    }
  }
}
