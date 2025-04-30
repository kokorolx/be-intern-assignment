import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';
import { Like } from '../entities/Like';
import { Hashtag } from '../entities/Hashtag';

interface FeedOptions {
  limit: number;
  offset: number;
}

export const feedService = {
  /**
   * Get user's personalized feed containing posts from followed users
   * @param userId - ID of the user requesting their feed
   * @param options - Pagination options
   * @returns Paginated list of posts with author details, like count, and hashtags
   */
  async getUserFeed(userId: number, options: FeedOptions) {
    const postRepository = AppDataSource.getRepository(Post);

    // Create query builder for posts
    const query = postRepository
      .createQueryBuilder('post')
      // Join with follows table to get posts from followed users
      .innerJoin(Follow, 'follow', 'follow.followingId = post.userId')
      .where('follow.followerId = :userId', { userId })
      // Join with user to get author details
      .innerJoinAndSelect('post.user', 'author')
      // Join with hashtags
      .leftJoinAndSelect('post.hashtags', 'hashtags')
      // Get like count using subquery
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      // Order by creation date, newest first
      .orderBy('post.createdAt', 'DESC')
      // Apply pagination
      .skip(options.offset)
      .take(options.limit)
      // Select specific fields for optimization
      .select([
        'post.id',
        'post.content',
        'post.createdAt',
        'author.id',
        'author.firstName',
        'author.lastName',
        'hashtags.id',
        'hashtags.name',
      ]);

    // Execute query and return results
    const [posts, total] = await query.getManyAndCount();

    return {
      posts,
      total,
      limit: options.limit,
      offset: options.offset,
    };
  },
};