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
  connection_userid_fk: number;

  @Column()
  connection_userid_fk_2: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;
}
