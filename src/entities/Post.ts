import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  VersionColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Hashtag } from './Hashtag';
import { IsNotEmpty } from 'class-validator';

/**
 * Post entity representing a user's post in the system.
 * This entity stores post content and maintains relationships with users.
 * Includes validation for required fields.
 */
@Entity('posts')
export class Post {
  /**
   * Unique identifier for the post.
   * Auto-generated incremental primary key.
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * Content of the post.
   * Required field that cannot be null.
   */
  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  content: string;

  /**
   * ID of the user who created the post.
   * Foreign key reference to the users table.
   */
  @Column({ nullable: false })
  userId: number;

  /**
   * Reference to the user who created the post.
   * Many-to-one relationship with User entity.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Timestamp of when the post was created.
   * Automatically set by TypeORM.
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  /**
   * Timestamp of when the post was last updated.
   * Automatically updated by TypeORM.
   */
  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  /**
   * Version number used for optimistic locking.
   * Automatically managed by TypeORM to prevent concurrent conflicting updates.
   */
  @VersionColumn()
  version: number;

  /**
   * Hashtags associated with this post.
   * Many-to-many relationship with Hashtag entity.
   */
  @ManyToMany(() => Hashtag, hashtag => hashtag.posts)
  @JoinTable()
  hashtags: Hashtag[];
}