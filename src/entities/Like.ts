import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

/**
 * Like entity representing a user's like on a post.
 * This entity maintains relationships between users and the posts they like.
 * Includes a unique constraint to prevent multiple likes from the same user on the same post.
 */
@Entity('likes')
@Unique(['userId', 'postId'])
export class Like {
  /**
   * Unique identifier for the like.
   * Auto-generated incremental primary key.
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * ID of the user who created the like.
   * Foreign key reference to the users table.
   */
  @Column({ nullable: false })
  userId: number;

  /**
   * Reference to the user who created the like.
   * Many-to-one relationship with User entity.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * ID of the post that was liked.
   * Foreign key reference to the posts table.
   */
  @Column({ nullable: false })
  postId: number;

  /**
   * Reference to the post that was liked.
   * Many-to-one relationship with Post entity.
   */
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  /**
   * Timestamp of when the like was created.
   * Automatically set by TypeORM.
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}