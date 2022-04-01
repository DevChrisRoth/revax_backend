import {
  Controller,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserData } from './userdata.entity';
import { UserLogin } from './users.entity';
import { UsersService } from './users.service';
@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  private uploadFolderPath = '../uploads/';
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login') //✅
  async login(@Request() req: any, @Ip() ip: any): Promise<any> {
    console.log('IP: ' + ip);
    return await req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(200)
  @Post('logout') //✅
  async logout(@Request() req: any, @Ip() ip: any): Promise<any> {
    console.log('IP: ' + ip);
    req.logout();
    return { status: 'success' };
  }

  @HttpCode(200)
  @Post('register') //✅
  async register(@Request() req: any, @Response() res: any): Promise<any> {
    try {
      const UserPersonalData: UserData = {
        firstname: req.body['firstname'],
        lastname: req.body['lastname'],
        phonenumber: req.body['phonenumber'],
        description: req.body['description'],
        jobcategory: req.body['jobcategory'],
        /*filename now */ image1: req.body['image1']
          ? this.uploadFolderPath + req.body['image1']
          : null,
        /*filename now */ image2: req.body['image2']
          ? this.uploadFolderPath + req.body['image2']
          : null,
        /*filename now */ image3: req.body['image3']
          ? this.uploadFolderPath + req.body['image3']
          : null,
        /*filename now */ image4: req.body['image4']
          ? this.uploadFolderPath + req.body['image4']
          : null,
        /*filename now */ image5: req.body['image5']
          ? this.uploadFolderPath + req.body['image5']
          : null,
        companyname: req.body['companyname'] ? req.body['companyname'] : null,
        website: req.body['website'] ? req.body['website'] : null,
      };
      const UserLoginData: UserLogin = {
        email: req.body['email'],
        password: req.body['password'],
        //0 = user, 1 = company
        type: req.body['type'] ? req.body['type'] : 0,
        confirmed: 0,
      };
      return res
        .status(200)
        .json(
          await this.userService.createUser(UserPersonalData, UserLoginData),
        );
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
    }
  }

  @Post('updateprofileimages') //✅
  @HttpCode(200)
  async updateImagePathss(@Request() req, @Response() res): Promise<any> {
    try {
      const filename1: string | null = req.body['image1'];
      const filename2: string | null = req.body['image2'];
      const filename3: string | null = req.body['image3'];
      const filename4: string | null = req.body['image4'];
      const filename5: string | null = req.body['image5'];
      const userid: string | undefined = req.body['userid'];
      console.table({
        filename1,
        filename2,
        filename3,
        filename4,
        filename5,
      });
      return res
        .status(200)
        .json(
          this.userService.updateProfileImages(
            userid,
            filename1,
            filename2,
            filename3,
            filename4,
            filename5,
          ),
        );
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profileimages')
  seeUploadedFile(@Request() req, @Res() res) {
    try {
      return res.status(200).json(this.userService.getImages(req.user.userid));
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('updateprofile') //✅
  async updatePersonalData(@Request() req: any, @Res() res): Promise<any> {
    try {
      const UserData: UserData = {
        firstname: req.body['firstname'],
        lastname: req.body['lastname'],
        phonenumber: req.body['phonenumber'],
        description: req.body['description'],
        image1: req.body['image1'] ? req.body['image1'] : null,
        image2: req.body['image2'] ? req.body['image2'] : null,
        image3: req.body['image3'] ? req.body['image3'] : null,
        image4: req.body['image4'] ? req.body['image4'] : null,
        image5: req.body['image5'] ? req.body['image5'] : null,
        jobcategory: req.body['jobcategory'],
        companyname: req.body['companyname'] ? req.body['companyname'] : null,
        website: req.body['website'] ? req.body['website'] : null,
      };

      return res
        .status(200)
        .json(await this.userService.updateUser(UserData, req.user.userid));
    } catch (err) {
      return res.status(500).json({ status: 'failed' });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('userdata') //✅
  async getUserdata(@Request() req: any): Promise<any> {
    try {
      console.log('userdata: ' + req.user.userid);
      return await this.userService.getUserdata(req.user.userid);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @Get('confirm/:token') //✅  (E-Mail link)
  async confirm(@Param() params, @Res() res): Promise<any> {
    try {
      return await this.userService.confirmUser(Number(params.token));
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
    }
  }

  //um das zurückzusetzen des Passwort abzuschließen (E-Mail link)
  @Get('resetpassword/:token') //✅
  async confirmResetPassword(@Param() params, @Res() res): Promise<any> {
    try {
      return await this.userService.confirmResetPassword(Number(params.token));
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
    }
  }

  //In-App Request for Password reset
  @HttpCode(200)
  @Post('resetpassword') //✅
  async resetPassword(@Request() req: any, @Res() res): Promise<any> {
    try {
      return await this.userService.resetPassword(
        req.body['email'],
        req.body['password'],
      );
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
    }
  }
}
