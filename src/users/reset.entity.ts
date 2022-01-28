import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reset_password')
export class ResetPassword {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  reset_id?: number;

  @Column({})
  userid_fk?: number;

  @Column({})
  email: string;

  @Column({})
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
