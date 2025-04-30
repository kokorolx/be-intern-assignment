import { Like } from '../entities/Like';
import { AppDataSource } from '../data-source';
import { QueryFailedError } from 'typeorm';

export interface CreateLikeDto {
  userId: number;
  postId: number;
}

export interface GetLikesOptions {
  userId?: number;
  postId?: number;
}

export class LikeService {
  private likeRepository = AppDataSource.getRepository(Like);

  private readonly defaultSelect = {
    id: true,
    userId: true,
    postId: true,
    createdAt: true,
    user: {
      id: true,
      firstName: true,
      lastName: true,
    },
    post: {
      id: true,
      content: true,
    },
  };

  /**
   * Creates a new like for a post.
   * @throws {Error} If the user has already liked the post (unique constraint violation)
   */
  async createLike(likeData: CreateLikeDto): Promise<Like> {
    try {
      const like = this.likeRepository.create(likeData);
      return await this.likeRepository.save(like);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('unique constraint')) {
        throw new Error('User has already liked this post');
      }
      throw error;
    }
  }

  /**
   * Retrieves likes with optional filtering by user or post.
   */
  async getLikes(options: GetLikesOptions): Promise<Like[]> {
    return this.likeRepository.find({
      select: this.defaultSelect,
      relations: ['user', 'post'],
      where: {
        ...(options.userId && { userId: options.userId }),
        ...(options.postId && { postId: options.postId }),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Retrieves a single like by its ID.
   */
  async getLikeById(id: number): Promise<Like | null> {
    return this.likeRepository.findOne({
      select: this.defaultSelect,
      relations: ['user', 'post'],
      where: { id },
    });
  }

  /**
   * Deletes a like by its ID.
   * @returns true if the like was deleted, false if it wasn't found
   */
  async deleteLike(id: number): Promise<boolean> {
    const result = await this.likeRepository.delete(id);
    return result.affected === 1;
  }

  /**
   * Checks if a user has liked a specific post.
   */
  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });
    return !!like;
  }
}