import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('possible_matches')
export class PossibleMatches {
  @PrimaryGeneratedColumn('increment')
  possible_matches_id: number;

  @Column()
  userid: number;

  @Column()
  userid_of_liked_user: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
