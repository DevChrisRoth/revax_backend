import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Jobcard } from './jobcard.entity';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Jobcard) private JobcardRepository: Repository<Jobcard>,
    @InjectConnection() private dbCon: Connection,
  ) {}

  async getRandomJobcard(_userid: number, _type: number): Promise<any> {
    if (_type == 1) return await this.getRandomUser(_userid);
    if (_type == 0) return await this.getRandomCard(_userid);
  }

  private async getRandomUser(_userid: number): Promise<any> {
    //get jobcategorys of users jobcards
    //iterate over all users, how has the same jobcategory
    //save all userids in an array
    
    //holt sich die jobcategorien der jobcards des users
    const jobcategorySelect =
      'SELECT distinct(jobcategory) from jobcard where userid_fk = ?';
    const jobcardCategorys = await this.dbCon.query(jobcategorySelect, [
      _userid,
    ]);
    //speichert die kategorien in einem array
    //nimmt sich eine zufällige kategorie
    //iteriert über alle user, die die kategorie haben
    //speichert alle userids in einem array
    //nimmt sich eine zufällige userid
    //gibt die userdaten und die jobcarddaten zurück


    const userid_array = [];
    for (let i = 0; i < jobcardCategorys.length; i++) {
      const jobcardCategory = jobcardCategorys[i].jobcategory;
      const useridSelect = `SELECT userid_fk from userdata where jobcategory = ?`;
      const userids = await this.dbCon.query(useridSelect, [jobcardCategory]);
      for (let j = 0; j < userids.length; j++) {
        userid_array.push(userids[j].userid_fk);
      }
    }
    Logger.log(userid_array);
    //get random userid from userid_array
    let randomNumber: number =
      Math.floor(Math.random() * userid_array.length) + 1;
    const UserData = await this.dbCon.query(
      `SElECT ud.firstname, ud.lastname, ud.phonenumber, ud.description, ud.image1, ud.image2, ud.image3, ud.image4, ud.image5,  ud.website,ud.jobcategory, ul.email, ul.userid from userdata as ud inner join userlogin as ul on ul.userid = ud.userid_fk where ud.userid_fk = ? `,
      [userid_array[randomNumber]],
    );
    Logger.log(randomNumber, UserData[0].userid);
    if (!UserData) throw new NotFoundException('No Data found');
    else return { UserData: UserData };
  }

  private async getRandomCard(_userid: number): Promise<any> {
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
      `SElECT ud.firstname, ud.lastname, ud.phonenumber, ud.description, ud.image1, ud.image2, ud.image3, ud.image4, ud.image5, ud.companyname, ud.website, ud.jobcategory, ul.email, ul.userid from userdata as ud, userlogin as ul where ud.userid_fk = ? and ul.userid = ?`,
      [JobcardData[0].userid_fk, JobcardData[0].userid_fk],
    );
    if (!JobcardData || !UserData) throw new NotFoundException('No Data found');
    else return { JobcardData: JobcardData, UserData: UserData };
  }

  private async getUsersCategory(_userid: number): Promise<string> {
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

  async getJobCardList(_userid: number): Promise<any> {
    try {
      return await this.JobcardRepository.find({
        where: { userid_fk: _userid },
      });
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
