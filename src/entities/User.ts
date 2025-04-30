import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  VersionColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

/**
 * User entity representing a user in the system.
 * This entity stores core user information and is used for user management and authentication.
 * Includes validation for required fields and email format.
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user.
   * Auto-generated incremental primary key.
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * User's first name.
   * Required field with length validation (1-255 characters).
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  /**
   * User's last name.
   * Required field with length validation (1-255 characters).
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  /**
   * User's email address.
   * Required field that must be unique across all users.
   * Must be a valid email format.
   */
  @Index()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Timestamp of when the user record was created.
   * Automatically set by TypeORM.
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  /**
   * Timestamp of when the user record was last updated.
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
}
