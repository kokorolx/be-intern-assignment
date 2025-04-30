import { Follow } from '../entities/Follow';
import { AppDataSource } from '../data-source';
import { QueryFailedError } from 'typeorm';

export interface CreateFollowDto {
  followerId: number;
  followingId: number;
}

export interface GetFollowsOptions {
  limit?: number;
  offset?: number;
}

export interface GetFollowersResponse {
  followers: Follow[];
  totalCount: number;
}

export class FollowService {
  private followRepository = AppDataSource.getRepository(Follow);

  private readonly defaultSelect = {
    id: true,
    followerId: true,
    followingId: true,
    createdAt: true,
    follower: {
      id: true,
      firstName: true,
      lastName: true,
    },
    following: {
      id: true,
      firstName: true,
      lastName: true,
    },
  };

  /**
   * Creates a new follow relationship.
   * @throws {Error} If the follow relationship already exists or user attempts to follow themselves
   */
  async createFollow(followData: CreateFollowDto): Promise<Follow> {
    if (followData.followerId === followData.followingId) {
      throw new Error('Users cannot follow themselves');
    }

    try {
      const follow = this.followRepository.create(followData);
      return await this.followRepository.save(follow);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('unique constraint')) {
        throw new Error('Follow relationship already exists');
      }
      throw error;
    }
  }

  /**
   * Deletes a follow relationship by ID.
   * @returns true if the follow relationship was deleted, false if it wasn't found
   */
  async deleteFollow(id: number): Promise<boolean> {
    const result = await this.followRepository.delete(id);
    return result.affected === 1;
  }

  /**
   * Deletes a follow relationship by follower and following IDs.
   * @returns true if the follow relationship was deleted, false if it wasn't found
   */
  async deleteFollowByUsers(followerId: number, followingId: number): Promise<boolean> {
    const result = await this.followRepository.delete({ followerId, followingId });
    return result.affected === 1;
  }

  /**
   * Gets followers of a specific user with pagination.
   */
  async getFollowers(userId: number, options: GetFollowsOptions = {}): Promise<GetFollowersResponse> {
    const { limit = 10, offset = 0 } = options;

    const [followers, totalCount] = await this.followRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        follower: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      relations: ['follower'],
      where: { followingId: userId },
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return { followers, totalCount };
  }

  /**
   * Gets users that a specific user is following with pagination.
   */
  async getFollowing(userId: number, options: GetFollowsOptions = {}): Promise<GetFollowersResponse> {
    const { limit = 10, offset = 0 } = options;

    const [following, totalCount] = await this.followRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        following: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      relations: ['following'],
      where: { followerId: userId },
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return { followers: following, totalCount };
  }

  /**
   * Checks if a follow relationship exists between two users.
   */
  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    return !!follow;
  }

  /**
   * Gets a follow relationship by its ID.
   */
  async getFollowById(id: number): Promise<Follow | null> {
    return this.followRepository.findOne({
      select: this.defaultSelect,
      relations: ['follower', 'following'],
      where: { id },
    });
  }
}