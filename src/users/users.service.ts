import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import * as bycript from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { Connection, Repository } from 'typeorm';
import { ResetPassword } from './reset.entity';
import { UserData } from './userdata.entity';
import { UserLogin } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserLogin)
    private UserLoginRepository: Repository<UserLogin>,
    @InjectConnection() private dbCon: Connection,
    @InjectRepository(UserData) private UserDataRepo: Repository<UserData>,
    @InjectRepository(UserLogin) private UserLoginRepo: Repository<UserLogin>,
    @InjectRepository(ResetPassword)
    private ResetRepo: Repository<ResetPassword>,
    private mailService: MailService,
  ) {}

  /**
   * E-Mail Service needs to be activated
   */
  async createUser(
    _UserData: UserData,
    _UserLoginData: UserLogin,
  ): Promise<
    | {
        userid: any;
        type: number;
        status?: undefined;
      }
    | {
        status: string;
        userid?: undefined;
        type?: undefined;
      }
  > {
    try {
      const usertable = {
        email: _UserLoginData.email,
        password: await bycript.hash(_UserLoginData.password, 12),
        type: _UserLoginData.type,
      };
      const usertable_sql = `INSERT INTO userlogin (email, password, type) VALUES ( ?, ?, ?)`;
      await this.dbCon.query(usertable_sql, [
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
        phonenumber: _UserData.phonenumber,
        description: _UserData.description,
        image1: _UserData.image1,
        image2: _UserData.image2,
        image3: _UserData.image3,
        image4: _UserData.image4,
        image5: _UserData.image5,
        companyname: _UserData.companyname ? _UserData.companyname : null,
        website: _UserData.website ? _UserData.website : null,
        userid_fk: _UserData.userid_fk[0].userid,
        jobcategory: _UserData.jobcategory,
      };
      const userdata_sql = `INSERT INTO userdata (firstname, lastname, phonenumber, description, image1, image2, image3, image4, image5,  companyname, website, userid_fk, jobcategory) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await this.dbCon.query(userdata_sql, [
        userdata.firstname,
        userdata.lastname,
        userdata.phonenumber,
        userdata.description,
        userdata.image1,
        userdata.image2,
        userdata.image3,
        userdata.image4,
        userdata.image5,
        userdata.companyname,
        userdata.website,
        userdata.userid_fk,
        userdata.jobcategory,
      ]);
      if (process.env.NODE_ENV === 'production') {
        await this.mailService.sendUserConfirmation(
          userdata.userid_fk,
          usertable.email,
          usertable.type,
          usertable.type == 0 ? _UserData.firstname : _UserData.companyname,
        );
      }

      return { userid: userdata.userid_fk, type: usertable.type };
    } catch (error) {
      return {
        status: 'failed',
      };
    }
  }
  async updateProfileImages(
    _userid_fk: string,
    _image1: any,
    _image2: any,
    _image3: any,
    _image4: any,
    _image5: any,
  ): Promise<{
    status: string;
  }> {
    try {
      await this.UserDataRepo.update(
        { userid_fk: Number(_userid_fk) },
        {
          image1: _image1,
          image2: _image2,
          image3: _image3,
          image4: _image4,
          image5: _image5,
        },
      );
      return { status: 'success' };
    } catch (error) {
      return {
        status: `failed`,
      };
    }
  }

  async getUserdata(_userid: string): Promise<
    | {
        firstname: string;
        lastname: string;
        phonenumber: string;
        description: string;
        image1: string;
        image2: string;
        image3: string;
        image4: string;
        image5: string;
        companyname: string;
        website: string;
        jobcategory: string;
        status?: undefined;
      }
    | any
  > {
    try {
      const userdatarepo = await this.UserDataRepo.findOneOrFail({
        select: [
          'firstname',
          'lastname',
          'phonenumber',
          'description',
          'image1',
          'image2',
          'image3',
          'image4',
          'image5',
          'companyname',
          'website',
          'jobcategory',
        ],
        where: {
          userid_fk: Number(_userid),
        },
      });
      return {
        firstname: userdatarepo.firstname,
        lastname: userdatarepo.lastname,
        phonenumber: userdatarepo.phonenumber,
        description: userdatarepo.description,
        image1: userdatarepo.image1,
        image2: userdatarepo.image2,
        image3: userdatarepo.image3,
        image4: userdatarepo.image4,
        image5: userdatarepo.image5,
        companyname: userdatarepo.companyname,
        website: userdatarepo.website,
        jobcategory: userdatarepo.jobcategory,
      };
    } catch (error) {
      return { status: 'failed' };
    }
  }

  async updateUser(
    _UserData: UserData,
    _userid: string,
  ): Promise<{
    status: string;
  }> {
    try {
      _UserData.userid_fk = Number(_userid);
      await this.UserDataRepo.update({ userid_fk: Number(_userid) }, _UserData);
      return { status: 'success' };
    } catch (error) {
      return {
        status: `failed`,
      };
    }
  }

  async getImages(_userid: string): Promise<
    | {
        image1: string;
        image2: string;
        image3: string;
        image4: string;
        image5: string;
        status?: undefined;
      }
    | {
        status: string;
        image1?: undefined;
        image2?: undefined;
        image3?: undefined;
        image4?: undefined;
        image5?: undefined;
      }
  > {
    try {
      const userdatarepo = await this.UserDataRepo.findOneOrFail({
        select: ['image1', 'image2', 'image3', 'image4', 'image5'],
        where: {
          userid_fk: Number(_userid),
        },
      });
      return {
        image1: userdatarepo.image1,
        image2: userdatarepo.image2,
        image3: userdatarepo.image3,
        image4: userdatarepo.image4,
        image5: userdatarepo.image5,
      };
    } catch (error) {
      return { status: 'failed' };
    }
  }

  private async updatePassword(
    _password: string,
    _userid: string,
  ): Promise<{
    status: string;
  }> {
    try {
      await this.UserLoginRepo.update(
        { userid: Number(_userid) },
        { password: _password },
      );
      return { status: 'success' };
    } catch (error) {
      return {
        status: `failed`,
      };
    }
  }

  async findByUsernameAndPassword(_email: string): Promise<UserLogin | any> {
    try {
      return await this.UserLoginRepository.findOneOrFail({
        select: ['type', 'email', 'password', 'userid'],
        where: {
          email: _email,
          confirmed: 1,
        },
      });
    } catch (error) {
      return { status: 'failed' };
    }
  }

  async confirmUser(_userid: number): Promise<{
    status: string;
  }> {
    try {
      await this.dbCon.query(
        `UPDATE userlogin SET confirmed = 1 WHERE userid = ?`,
        [_userid],
      );
      return { status: 'Account nun aktiv' };
    } catch (error) {
      return {
        status: `failed`,
      };
    }
  }

  async confirmResetPassword(_resetToken: number): Promise<{
    status: string;
  }> {
    try {
      const resetData = await this.ResetRepo.findOneOrFail({
        select: ['userid_fk', 'password'],
        where: {
          reset_id: _resetToken,
        },
      });
      await this.updatePassword(
        resetData.password,
        resetData.userid_fk.toString(),
      );
      await this.ResetRepo.delete({ reset_id: _resetToken });
      return { status: 'success' };
    } catch (error) {
      return { status: 'failed' };
    }
  }

  async resetPassword(
    _email: string,
    _password: string,
  ): Promise<{
    status: string;
  }> {
    try {
      const user = await this.UserLoginRepository.findOneOrFail({
        select: ['userid'],
        where: {
          email: _email,
        },
      });
      const resetData = {
        userid_fk: user.userid,
        password: _password,
        email: _email,
      };
      await this.ResetRepo.insert(resetData);
      const resetId = await this.ResetRepo.findOneOrFail({
        select: ['reset_id'],
        where: {
          userid_fk: user.userid,
        },
      });
      await this.mailService.sendUserResetPassword(resetId.reset_id, _email);
      return { status: 'success' };
    } catch (error) {
      return {
        status: `failed`,
      };
    }
  }
  async updateUsersProfileImageFilenames(
    _filename1: string,
    _filename2: string,
    _filename3: string,
    _filename4: string,
    _filename5: string,
    _userid: number,
  ): Promise<{
    status: string;
  }> {
    try {
      await this.dbCon.query(
        `UPDATE userdata SET image1 = ?, image2 = ?, image3 = ?, image4 = ?, image5 = ? WHERE userid_fk = ?`,
        [_filename1, _filename2, _filename3, _filename4, _filename5, _userid],
      );
      return { status: 'success' };
    } catch (error) {
      return {
        status: `failed`,
      };
    }
  }
}
