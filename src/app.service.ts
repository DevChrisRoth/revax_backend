import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import * as bycript from 'bcryptjs';
import { Connection, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CompanyService } from './company/company.service';
import { Jobcard } from './company/Jobcard.entity';
import { PossibleMatchesService } from './possible-matches/possible-matches.service';
import { UserData } from './users/UserData.entity';
import { UserLogin } from './users/users.entity';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserData) private UserDataRepo: Repository<UserData>,
    @InjectRepository(UserLogin) private UserLoginRepo: Repository<UserLogin>,
    private companyService: CompanyService,
    private possibleMatcheService: PossibleMatchesService,
    @InjectConnection() private dbCon: Connection,
  ) {}

  async createUser(
    _UserData: UserData,
    UserLoginData: UserLogin,
  ): Promise<any> {
    try {
      const userid_ge = uuidv4();
      const usertable = {
        email: UserLoginData.email,
        password: await bycript.hash(UserLoginData.password, 12),
        type: UserLoginData.type,
      };
      const usertable_sql = `INSERT INTO userlogin (email, password, type) VALUES ( ?, ?, ?)`;
      const UserData = await this.dbCon.query(usertable_sql, [
        usertable.email,
        usertable.password,
        usertable.type,
      ]);
      _UserData.userid_fk = await this.dbCon.query(
        `SELECT userid FROM userlogin WHERE email = ?`,
        [usertable.email],
      );
      const userdata = {
        firstname: _UserData.firstname,
        lastname: _UserData.lastname,
        birthday: _UserData.birthday,
        phonenumber: _UserData.phonenumber,
        description: _UserData.description,
        image1: _UserData.image1,
        image2: _UserData.image2,
        image3: _UserData.image3,
        image4: _UserData.image4,
        image5: _UserData.image5,
        plz: _UserData.plz,
        place: _UserData.place,
        companyname: _UserData.companyname ? _UserData.companyname : null,
        website: _UserData.website ? _UserData.website : null,
        userid_fk: _UserData.userid_fk[0].userid,
      };
      const userdata_sql = `INSERT INTO userdata (firstname, lastname, birthday, phonenumber, description, image1, image2, image3, image4, image5, plz, place, companyname, website, userid_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await this.dbCon.query(userdata_sql, [
        userdata.firstname,
        userdata.lastname,
        userdata.birthday,
        userdata.phonenumber,
        userdata.description,
        userdata.image1,
        userdata.image2,
        userdata.image3,
        userdata.image4,
        userdata.image5,
        userdata.plz,
        userdata.place,
        userdata.companyname,
        userdata.website,
        userdata.userid_fk,
      ]);

      Logger.log(`User successfully created (Userid: ${UserData.userid})`);
      return { status: 'success' };
    } catch (error) {
      Logger.error(error);
      return {
        error: 'Email already exists. Please choose another one.',
      };
    }
  }

  async updateUser(
    UserData: any,
    userid: string,
    password: string,
  ): Promise<any> {
    try {
      UserData.userdataid = userid;
      await this.UserDataRepo.update({ userdataid: userid }, UserData);
      if (password != null) await this.updatePassword(password, userid);
      Logger.log(`User's data updated successfully (Userid: ${userid})`);
      return { status: 'success' };
    } catch (error) {
      Logger.error(`Error while updating Userprofile (Userid: ${userid}).`);
      return {
        error: `Updating your Userprofile failed. Please try again or contact the Support.`,
      };
    }
  }

  private async updatePassword(password: string, userid: string) {
    try {
      await this.UserLoginRepo.update(
        { userid: Number(userid) },
        { password: password },
      );
      Logger.log(
        `User's password updated successfully (Userid: ${userid}, password: ${password})`,
      );
      return { status: 'success' };
    } catch (error) {
      Logger.error(`Error while updating User's password (Userid: ${userid}).`);
      return {
        error: `Updating your password failed. Please try again or contact the Support.`,
      };
    }
  }

  async getRandomJobcard(userid: string): Promise<Jobcard | any> {
    return await this.companyService.getRandomJobcard(userid);
  }

  async createJobcard(jobcard: any): Promise<any> {
    return await this.companyService.createJobcard(jobcard);
  }

  async evalRecommendation(_userid: number, _cardid: number): Promise<any> {
    return await this.possibleMatcheService.evalRecommendation(
      _userid,
      _cardid,
    );
  }
}
