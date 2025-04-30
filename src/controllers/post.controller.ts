import { Request, Response } from 'express';
import { PostService, CreatePostDto, UpdatePostDto } from '../services/post.service';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  /**
   * Get a paginated list of all posts
   * @route GET /api/posts
   * @param req Express request object with query parameters:
   *    - page (number, optional): Page number for pagination (default: 1)
   *    - limit (number, optional): Number of posts per page (default: 10)
   * @param res Express response object
   * @returns {Promise<void>} JSON response with:
   *    - data: Array of post objects with user information
   *    - pagination: Pagination details
   * @throws {400} Invalid pagination parameters
   * @throws {500} Server error while fetching posts
   */
  async getPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);

      if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page and limit must be positive integers'
        });
      }

      const result = await this.postService.getPosts({ page, limit });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getPosts:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching posts'
      });
    }
  }

  /**
   * Get a post by its ID
   * @route GET /api/posts/:id
   * @param req Express request object with parameters:
   *    - id (number): Post ID
   * @param res Express response object
   * @returns {Promise<void>} JSON response with post object and user information
   * @throws {400} Invalid post ID format
   * @throws {404} Post not found
   * @throws {500} Server error while fetching post
   */
  async getPostById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post ID format'
        });
      }

      const post = await this.postService.getPostById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error in getPostById:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching post'
      });
    }
  }

  /**
   * Create a new post
   * @route POST /api/posts
   * @param req Express request object with body (CreatePostDto):
   *    - content (string): Post content
   *    - userId (number): ID of the user creating the post
   * @param res Express response object
   * @returns {Promise<void>} JSON response with created post object
   * @throws {400} Invalid post data
   * @throws {500} Server error while creating post
   */
  async createPost(req: Request, res: Response) {
    try {
      const postData = req.body as CreatePostDto;
      const post = await this.postService.createPost(postData);
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error in createPost:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while creating post'
      });
    }
  }

  /**
   * Update an existing post
   * @route PUT /api/posts/:id
   * @param req Express request object with:
   *    - params.id (number): Post ID
   *    - body (UpdatePostDto): Updated post data
   *        - content (string): Updated post content
   * @param res Express response object
   * @returns {Promise<void>} JSON response with updated post object
   * @throws {400} Invalid post ID format or invalid update data
   * @throws {404} Post not found
   * @throws {500} Server error while updating post
   */
  async updatePost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post ID format'
        });
      }

      const updateData = req.body as UpdatePostDto;
      const post = await this.postService.updatePost(id, updateData);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error in updatePost:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while updating post'
      });
    }
  }

  /**
   * Delete a post
   * @route DELETE /api/posts/:id
   * @param req Express request object with parameters:
   *    - id (number): Post ID
   * @param res Express response object
   * @returns {Promise<void>} Empty response with 204 status on success
   * @throws {400} Invalid post ID format
   * @throws {404} Post not found
   * @throws {500} Server error while deleting post
   */
  async deletePost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post ID format'
        });
      }

      const deleted = await this.postService.deletePost(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.status(204).json({
        success: true,
        data: null
      });
    } catch (error) {
      console.error('Error in deletePost:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while deleting post'
      });
    }
  }
}