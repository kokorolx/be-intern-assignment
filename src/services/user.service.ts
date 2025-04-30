import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
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

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  private readonly defaultSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    createdAt: true,
    updatedAt: true
  };

  async getAllUsers(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = Math.max(1, options.page);
    const limit = Math.max(1, Math.min(100, options.limit));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.find({
        select: this.defaultSelect,
        take: limit,
        skip: skip,
      }),
      this.userRepository.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      select: this.defaultSelect,
      where: { id }
    });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateData: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected === 1;
  }
}