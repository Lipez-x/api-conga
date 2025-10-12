import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('login_attempts')
export class LoginAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  success: boolean;

  @Column({ nullable: true })
  ip?: string;

  @Column()
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;
}
