import { Repository } from 'typeorm';
import { Post } from '../entities/Post';
import { Like } from '../entities/Like';
import { Follow } from '../entities/Follow';
import { AppDataSource } from '../data-source';

export interface GetActivityOptions {
  type?: 'post' | 'like' | 'follow';
  startDate?: Date;
  endDate?: Date;
  limit: number;
  offset: number;
}

interface ActivityBase {
  id: number;
  activityType: 'post' | 'like' | 'follow';
  activityDate: Date;
}

interface PostActivity extends ActivityBase {
  activityType: 'post';
  content: string;
}

interface LikeActivity extends ActivityBase {
  activityType: 'like';
  postId: number;
}

interface FollowActivity extends ActivityBase {
  activityType: 'follow';
  followingId: number;
}

type Activity = PostActivity | LikeActivity | FollowActivity;

export class ActivityService {
  private postRepository: Repository<Post>;
  private likeRepository: Repository<Like>;
  private followRepository: Repository<Follow>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
    this.likeRepository = AppDataSource.getRepository(Like);
    this.followRepository = AppDataSource.getRepository(Follow);
  }

  async getUserActivity(userId: number, options: GetActivityOptions): Promise<{ activities: Activity[]; totalCount: number }> {
    const { type, startDate, endDate, limit, offset } = options;

    // If specific type is requested, only fetch that type
    if (type) {
      return await this.getSpecificActivityType(userId, type, options);
    }

    // Otherwise, fetch all types and combine
    const [postActivities, postCount] = await this.getPostActivities(userId, options);
    const [likeActivities, likeCount] = await this.getLikeActivities(userId, options);
    const [followActivities, followCount] = await this.getFollowActivities(userId, options);

    // Combine all activities and sort by date
    const allActivities = [...postActivities, ...likeActivities, ...followActivities]
      .sort((a, b) => b.activityDate.getTime() - a.activityDate.getTime());

    // Apply pagination to combined results
    const activities = allActivities.slice(offset, offset + limit);
    const totalCount = postCount + likeCount + followCount;

    return { activities, totalCount };
  }

  private async getSpecificActivityType(
    userId: number,
    type: 'post' | 'like' | 'follow',
    options: GetActivityOptions
  ): Promise<{ activities: Activity[]; totalCount: number }> {
    switch (type) {
      case 'post':
        const [posts, postCount] = await this.getPostActivities(userId, options);
        return { activities: posts, totalCount: postCount };
      case 'like':
        const [likes, likeCount] = await this.getLikeActivities(userId, options);
        return { activities: likes, totalCount: likeCount };
      case 'follow':
        const [follows, followCount] = await this.getFollowActivities(userId, options);
        return { activities: follows, totalCount: followCount };
      default:
        throw new Error('Invalid activity type');
    }
  }

  private async getPostActivities(
    userId: number,
    options: GetActivityOptions
  ): Promise<[PostActivity[], number]> {
    const { startDate, endDate } = options;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.userId = :userId', { userId })
      .select([
        'post.id as id',
        'post.content as content',
        'post.createdAt as activityDate',
        '"post" as activityType'
      ]);

    if (startDate) {
      queryBuilder.andWhere('post.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('post.createdAt <= :endDate', { endDate });
    }

    const [posts, count] = await Promise.all([
      queryBuilder
        .orderBy('post.createdAt', 'DESC')
        .getRawMany(),
      queryBuilder.getCount()
    ]);

    return [posts as PostActivity[], count];
  }

  private async getLikeActivities(
    userId: number,
    options: GetActivityOptions
  ): Promise<[LikeActivity[], number]> {
    const { startDate, endDate } = options;

    const queryBuilder = this.likeRepository
      .createQueryBuilder('like')
      .where('like.userId = :userId', { userId })
      .select([
        'like.id as id',
        'like.postId as postId',
        'like.createdAt as activityDate',
        '"like" as activityType'
      ]);

    if (startDate) {
      queryBuilder.andWhere('like.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('like.createdAt <= :endDate', { endDate });
    }

    const [likes, count] = await Promise.all([
      queryBuilder
        .orderBy('like.createdAt', 'DESC')
        .getRawMany(),
      queryBuilder.getCount()
    ]);

    return [likes as LikeActivity[], count];
  }

  private async getFollowActivities(
    userId: number,
    options: GetActivityOptions
  ): Promise<[FollowActivity[], number]> {
    const { startDate, endDate } = options;

    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followerId = :userId', { userId })
      .select([
        'follow.id as id',
        'follow.followingId as followingId',
        'follow.createdAt as activityDate',
        '"follow" as activityType'
      ]);

    if (startDate) {
      queryBuilder.andWhere('follow.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('follow.createdAt <= :endDate', { endDate });
    }

    const [follows, count] = await Promise.all([
      queryBuilder
        .orderBy('follow.createdAt', 'DESC')
        .getRawMany(),
      queryBuilder.getCount()
    ]);

    return [follows as FollowActivity[], count];
  }
}