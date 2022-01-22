import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('userlogin')
export class UserLogin {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  userid?: number;

  @Column({ length: 150, nullable: false })
  password: string;

  @Column({ length: 50, unique: true })
  email: string;

  //0 = user, 1 = company
  @Column({ default: 0 })
  type: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
