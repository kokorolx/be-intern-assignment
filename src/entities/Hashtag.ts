import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Unique
} from 'typeorm';
import { Post } from './Post';
import { IsNotEmpty } from 'class-validator';

/**
 * Hashtag entity representing a hashtag that can be attached to posts.
 * Implements a many-to-many relationship with posts.
 */
@Entity('hashtags')
@Unique(['tag'])
export class Hashtag {
  /**
   * Unique identifier for the hashtag.
   * Auto-generated incremental primary key.
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * The hashtag text.
   * Must be unique and non-null.
   */
  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  tag: string;

  /**
   * Timestamp of when the hashtag was created.
   * Automatically set by TypeORM.
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  /**
   * Posts that have this hashtag.
   * Many-to-many relationship with Post entity.
   */
  @ManyToMany(() => Post, post => post.hashtags)
  posts: Post[];
}