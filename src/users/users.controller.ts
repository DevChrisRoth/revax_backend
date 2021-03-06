import {
  Body,
  Controller,
  Get,
  HttpCode,
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
  async login(@Request() req: any): Promise<any> {
    return await req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(200)
  @Post('logout') //✅
  async logout(@Request() req: any): Promise<{
    status: string;
  }> {
    try {
      req.logout();
      return { status: 'success' };
    } catch (error) {
      return { status: 'failed' };
    }
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
  async updateImagePaths(
    @Body() userid,
    @Body() image1: any,
    @Body() image2,
    @Body() image3,
    @Body() image4,
    @Body() image5,
    @Response() res,
  ): Promise<any> {
    try {
      //if isRegister == 0 || false (profilescreen)
      return res
        .status(200)
        .json(
          await this.userService.updateProfileImages(
            userid.userid,
            image1.image1 != 'undefined' ? image1.image1 : null,
            image2.image2 != 'undefined' ? image2.image2 : null,
            image3.image3 != 'undefined' ? image3.image3 : null,
            image4.image4 != 'undefined' ? image4.image4 : null,
            image5.image5 != 'undefined' ? image5.image5 : null,
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
