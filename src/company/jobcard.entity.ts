import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobcard')
export class Jobcard {
  @PrimaryGeneratedColumn('increment')
  jobcardid: number;

  @Column()
  userid_fk: number;

  @Column({ length: 255, nullable: false })
  description: string;

  @Column({ length: 100, nullable: false })
  jobtitle: string;

  //fulltime - parttime - freelance
  @Column({ length: 100, nullable: false })
  jobtype: string;

  //softwareengineering - webdevelopment - graphicdesign - marketing - HR
  @Column({ length: 100, nullable: false })
  jobcategory: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
