import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('userdata')
export class UserData {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  userdataid?: string | number;

  @Column()
  userid_fk?: number;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 50 })
  phonenumber: string;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 255, nullable: true, default: null })
  image1: string;

  @Column({ length: 255, nullable: true, default: null })
  image2: string;

  @Column({ length: 255, nullable: true, default: null })
  image3: string;

  @Column({ length: 255, nullable: true, default: null })
  image4: string;

  @Column({ length: 255, nullable: true, default: null })
  image5: string;

  @Column({ length: 100, nullable: true, default: null })
  jobcategory?: string;

  @Column({ nullable: true, default: null, length: 100 })
  companyname: string;

  @Column({ nullable: true, default: null, length: 50 })
  website: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
