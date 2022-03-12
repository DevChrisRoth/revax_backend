import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Request,
  Res,
  Response,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { editFileName, imageFileFilter } from './file-upload.utils';
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

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('image', 5, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Request() req: any,
    @Body() body: any,
  ): Promise<any> {
    if (req.headers['authorization'] === process.env.UPLOAD_KEY) {
      //store filenames into database where userid = req.user.userid
      const image1Filename = images[0] != undefined ? images[0].filename : null;
      const image2Filename = images[1] != undefined ? images[1].filename : null;
      const image3Filename = images[2] != undefined ? images[2].filename : null;
      //store new filenames in database!!!
      images[3] != undefined ? images[3].filename : null;
      const image4Filename = images[4] != undefined ? images[4].filename : null;
      const image5Filename = images[5] != undefined ? images[5].filename : null;
      const userid = body['userid'];

      return await this.userService.updateUsersProfileImageFilenames(
        image1Filename,
        image2Filename,
        image3Filename,
        image4Filename,
        image5Filename,
        userid,
      );
    } else {
      images.forEach((image) => {
        fs.unlink(image.path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('File deleted');
          }
        });
      });
      return { status: 'failed' };
    }
  }

  @Get('filename/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(200)
  @Post('updateprofile') //✅
  async updatePersonalData(@Request() req: any): Promise<any> {
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
  @HttpCode(200)
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
