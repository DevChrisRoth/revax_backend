import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chatroom')
export class Chatroom {
  @PrimaryGeneratedColumn('increment')
  chatroom_id: number;

  @Column()
  normal_userid_fk: number;

  @Column()
  company_userid_fk: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;
}
