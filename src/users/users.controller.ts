import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserData } from './UserData.entity';
import { UserLogin } from './users.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login') //✅
  async login(@Request() req: any): Promise<any> {
    return await req.user;
  }

  @Post('register') //✅
  async register(@Request() req: any): Promise<any> {
    try {
      const UserPersonalData: UserData = {
        firstname: req.body['firstname'],
        lastname: req.body['lastname'],
        birthday: req.body['birthday'],
        phonenumber: req.body['phonenumber'],
        description: req.body['description'],
        jobcategory: req.body['jobcategory'],
        image1: req.body['image1'] ? req.body['image1'] : null,
        image2: req.body['image2'] ? req.body['image2'] : null,
        image3: req.body['image3'] ? req.body['image3'] : null,
        image4: req.body['image4'] ? req.body['image4'] : null,
        image5: req.body['image5'] ? req.body['image5'] : null,
        plz: req.body['plz'],
        place: req.body['place'],
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
      return await this.userService.createUser(UserPersonalData, UserLoginData);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('updateprofile') //✅
  async updatePersonalData(@Request() req: any): Promise<any> {
    try {
      const UserData = {
        firstname: req.body['firstname'],
        lastname: req.body['lastname'],
        birthday: req.body['birthday'],
        phonenumber: req.body['phonenumber'],
        description: req.body['description'],
        image1: req.body['image1'] ? req.body['image1'] : null,
        image2: req.body['image2'] ? req.body['image2'] : null,
        image3: req.body['image3'] ? req.body['image3'] : null,
        image4: req.body['image4'] ? req.body['image4'] : null,
        image5: req.body['image5'] ? req.body['image5'] : null,
        plz: req.body['plz'],
        place: req.body['place'],
        companyname: req.body['companyname'] ? req.body['companyname'] : null,
        website: req.body['website'] ? req.body['website'] : null,
      };
      const password = req.body['password'] ? req.body['password'] : null;
      return await this.userService.updateUser(
        UserData,
        req.user.userid,
        password,
      );
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @Get('confirm/:token') //✅  (E-Mail link)
  async confirm(@Param() params): Promise<any> {
    try {
      return await this.userService.confirmUser(Number(params.token));
    } catch (error) {
      return { status: 'failed' };
    }
  }

  //um das zurückzusetzen des Passwort abzuschließen (E-Mail link)
  @Get('resetpassword/:token') //✅
  async confirmResetPassword(@Param() params): Promise<any> {
    try {
      return await this.userService.confirmResetPassword(Number(params.token));
    } catch (error) {
      return { status: 'failed' };
    }
  }

  //In-App Request for Password reset
  @Post('resetpassword') //✅
  async resetPassword(@Request() req: any): Promise<any> {
    try {
      return await this.userService.resetPassword(
        req.body['email'],
        req.body['password'],
      );
    } catch (error) {
      return { status: error };
    }
  }
}
