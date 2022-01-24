import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Jobcard } from './Jobcard.entity';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Jobcard) private JobcardRepository: Repository<Jobcard>,
    @InjectConnection() private dbCon: Connection,
  ) {}

  async getRandomJobcard(_userid: string): Promise<any> {
    const count = await this.JobcardRepository.findAndCount({
      where: { jobcategory: await this.getUsersCategory(_userid) },
    });
    //iterate over count[0] and save all jobcardid's in an array
    const jobcardid_array = [];
    for (let i = 0; i < count[1]; i++) {
      jobcardid_array.push(count[0][i].jobcardid);
    }
    let randomNumber: number =
      jobcardid_array[Math.floor(Math.random() * jobcardid_array.length)];
    const JobcardData = await this.dbCon.query(
      'select jobcardid, description, jobtitle, userid_fk, jobtype, jobcategory from jobcard where jobcardid = ?',
      [randomNumber],
    );
    const UserData = await this.dbCon.query(
      `SElECT ud.firstname, ud.lastname, ud.phonenumber, ud.description, ud.image1, ud.image2, ud.image3, ud.image4, ud.image5, ud.plz, ud.place, ud.companyname, ud.website, ul.email, ul.userid from userdata as ud, userlogin as ul where ud.userid_fk = ? and ul.userid = ?`,
      [JobcardData[0].userid_fk, JobcardData[0].userid_fk],
    );
    if (!JobcardData || !UserData) throw new NotFoundException('No Data found');
    else return { JobcardData: JobcardData, UserData: UserData };
  }

  private async getUsersCategory(_userid: string): Promise<string> {
    const JobcardData = await this.dbCon.query(
      `SELECT jobcategory from userdata where userid_fk = ?`,
      [_userid],
    );
    return JobcardData[0].jobcategory;
  }

  async createJobcard(JobcardData: Jobcard): Promise<any> {
    try {
      const Jobcard = this.JobcardRepository.create(JobcardData);
      await this.JobcardRepository.save(Jobcard);
      return { status: 'success' };
    } catch {
      return { status: 'failed' };
    }
  }

  async deleteJobCard(_jobcardid: number): Promise<any> {
    try {
      await this.JobcardRepository.delete(_jobcardid);
      return { status: 'success' };
    } catch {
      return { status: 'failed' };
    }
  }
}
