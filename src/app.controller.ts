import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { RateLimit } from 'nestjs-rate-limiter';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserData } from './users/UserData.entity';
import { UserLogin } from './users/users.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RateLimit({
    keyPrefix: 'login',
    points: 100,
    duration: 60,
    errorMessage: 'Login cannot be executed more than once in per minute',
    clearExpiredByTimeout: true,
    maxQueueSize: 1,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login') //✅
  async login(@Request() req: any): Promise<any> {
    return await req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  protected(@Request() req: any): any {
    return { loggedin: 'true' };
  }

  @RateLimit({
    keyPrefix: 'register',
    points: 2000,
    duration: 60,
    errorMessage:
      'Registration cannot be executed more than once in per minute',
    clearExpiredByTimeout: true,
    maxQueueSize: 1,
  })
  @Post('register') //✅
  async register(@Request() req: any): Promise<any> {
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
      type: req.body['type'] ? req.body['type'] : 0,
    };
    return await this.appService.createUser(UserPersonalData, UserLoginData);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('updateprofile') //✅
  async updatePersonalData(@Request() req: any): Promise<any> {
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
    return await this.appService.updateUser(
      UserData,
      req.user.userid,
      password,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Get('jobcard') //✅
  async getRandomCard(@Request() req: any): Promise<any> {
    return await this.appService.getRandomJobcard(req.user.userid);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('jobcard') //✅
  async createJobcard(@Request() req: any): Promise<any> {
    const jobcard = {
      jobtitle: req.body['title'],
      description: req.body['description'],
      jobcategory: req.body['category'],
      jobtype: req.body['type'],
      userid_fk: req.user.userid,
    };
    return await this.appService.createJobcard(jobcard);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('recommendation')
  async getRecommendation(@Request() req: any): Promise<any> {
    if (Number(req.body['recommendation']) == 0) {
      return null;
    } else {
      return await this.appService.evalRecommendation(
        req.user.userid,
        req.body['cardid'],
      );
    }
  }
}
