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

/**
 * Follow entity representing a follow relationship between users.
 * This entity stores the relationship where one user (follower) follows another user (following).
 * Includes a unique constraint to prevent duplicate follow relationships.
 */
@Entity('follows')
@Unique(['followerId', 'followingId'])
export class Follow {
  /**
   * Unique identifier for the follow relationship.
   * Auto-generated incremental primary key.
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * ID of the user who is following.
   * Foreign key reference to the User entity.
   */
  @Column({ nullable: false })
  followerId: number;

  /**
   * ID of the user being followed.
   * Foreign key reference to the User entity.
   */
  @Column({ nullable: false })
  followingId: number;

  /**
   * Reference to the User entity representing the follower.
   * Many-to-one relationship with User, cascading on delete.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  /**
   * Reference to the User entity representing the user being followed.
   * Many-to-one relationship with User, cascading on delete.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: User;

  /**
   * Timestamp of when the follow relationship was created.
   * Automatically set by TypeORM.
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}