import { Post } from '../entities/Post';
import { AppDataSource } from '../data-source';

export interface CreatePostDto {
  content: string;
  userId: number;
}

export interface UpdatePostDto {
  content: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class PostService {
  private postRepository = AppDataSource.getRepository(Post);

  private readonly defaultSelect = {
    id: true,
    content: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    user: {
      id: true,
      firstName: true,
      lastName: true,
    },
  };

  async getPosts(options: PaginationOptions): Promise<PaginatedResult<Post>> {
    const page = Math.max(1, options.page);
    const limit = Math.max(1, Math.min(100, options.limit));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postRepository.find({
        select: this.defaultSelect,
        relations: ['user'],
        take: limit,
        skip: skip,
        order: {
          createdAt: 'DESC',
        },
      }),
      this.postRepository.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getPostById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      select: this.defaultSelect,
      relations: ['user'],
      where: { id },
    });
  }

  async createPost(postData: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(postData);
    return this.postRepository.save(post);
  }

  async updatePost(id: number, updateData: UpdatePostDto): Promise<Post | null> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      return null;
    }

    this.postRepository.merge(post, updateData);
    return this.postRepository.save(post);
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await this.postRepository.delete(id);
    return result.affected === 1;
  }
}