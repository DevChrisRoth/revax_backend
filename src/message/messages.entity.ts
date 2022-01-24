import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn('increment')
  message_id: number;

  @Column()
  chatroomid_fk: number;

  //userid of the sender of the message
  @Column()
  userid_fk: number;

  @Column({ length: '1000' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  message_created_at?: Date;
}
