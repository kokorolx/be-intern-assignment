import { DataSource, Repository } from 'typeorm';
import { Hashtag } from '../entities/Hashtag';
import { Post } from '../entities/Post';
import { AppError } from '../utils/AppError';

export class HashtagService {
  private hashtagRepository: Repository<Hashtag>;
  private postRepository: Repository<Post>;

  constructor(private dataSource: DataSource) {
    this.hashtagRepository = this.dataSource.getRepository(Hashtag);
    this.postRepository = this.dataSource.getRepository(Post);
  }

  /**
   * Finds an existing hashtag or creates a new one if it doesn't exist.
   * @param tag The hashtag text (will be converted to lowercase)
   * @returns The found or created hashtag
   */
  async findOrCreateHashtag(tag: string): Promise<Hashtag> {
    const lowercaseTag = tag.toLowerCase();

    let hashtag = await this.hashtagRepository.findOne({
      where: { tag: lowercaseTag }
    });

    if (!hashtag) {
      hashtag = this.hashtagRepository.create({ tag: lowercaseTag });
      await this.hashtagRepository.save(hashtag);
    }

    return hashtag;
  }

  /**
   * Adds a hashtag to a post.
   * @param postId The ID of the post
   * @param tag The hashtag text or existing hashtag ID
   * @returns The updated post with the new hashtag
   */
  async addHashtagToPost(postId: number, tag: string | number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['hashtags']
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    let hashtag: Hashtag;
    if (typeof tag === 'string') {
      hashtag = await this.findOrCreateHashtag(tag);
    } else {
      const existingHashtag = await this.hashtagRepository.findOne({
        where: { id: tag }
      });
      if (!existingHashtag) {
        throw new AppError('Hashtag not found', 404);
      }
      hashtag = existingHashtag;
    }

    // Initialize hashtags array if it doesn't exist
    if (!post.hashtags) {
      post.hashtags = [];
    }

    // Check if hashtag is already added to post
    if (!post.hashtags.some(h => h.id === hashtag.id)) {
      post.hashtags.push(hashtag);
      await this.postRepository.save(post);
    }

    return post;
  }

  /**
   * Removes a hashtag from a post.
   * @param postId The ID of the post
   * @param tag The hashtag text
   * @returns The updated post without the removed hashtag
   */
  async removeHashtagFromPost(postId: number, tag: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['hashtags']
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const lowercaseTag = tag.toLowerCase();

    if (post.hashtags) {
      post.hashtags = post.hashtags.filter(h => h.tag !== lowercaseTag);
      await this.postRepository.save(post);
    }

    return post;
  }

  /**
   * Gets posts that have a specific hashtag.
   * @param tag The hashtag text to search for
   * @param options Pagination options
   * @returns Posts with the specified hashtag
   */
  async getPostsByHashtag(
    tag: string,
    options: { skip?: number; take?: number } = { skip: 0, take: 10 }
  ): Promise<{ posts: (Post & { likeCount: number })[]; total: number }> {
    const lowercaseTag = tag.toLowerCase();

    // Create query builder for posts
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.hashtags', 'hashtag')
      .innerJoinAndSelect('post.user', 'user', 'user.id = post.userId')
      .leftJoin('post.likes', 'likes')
      .addSelect([
        'user.id',
        'user.firstName',
        'user.lastName'
      ])
      .addSelect('COALESCE(COUNT(DISTINCT likes.id), 0)', 'likeCount')
      .where('LOWER(hashtag.tag) = :tag', { tag: lowercaseTag })
      .groupBy('post.id, user.id, hashtag.id')
      .orderBy('post.createdAt', 'DESC')
      .skip(options.skip)
      .take(options.take);

    // Execute query and get raw results to access the like count
    const [rawPosts, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount()
    ]);

    // Transform the results to include like count
    const transformedPosts = rawPosts.entities.map((post, index) => ({
      ...post,
      likeCount: parseInt(rawPosts.raw[index].likeCount || '0')
    }));

    return { posts: transformedPosts, total };
  }
}