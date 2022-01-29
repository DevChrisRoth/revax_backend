import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { CompanyService } from './company.service';
import { Jobcard } from './jobcard.entity';
@Controller()
export class CompanyController {
  constructor(
    @InjectConnection()
    private dbCon: Connection,
    private readonly companyService: CompanyService,
  ) {}

  @Get('jobcategorys')
  async countJobcategory(@Body('keyword') keyword: string): Promise<any> {
    const queryAllJobcategorys = `SELECT jobcategory, count(jobcategory) as count FROM userdata WHERE jobcategory LIKE ? group by jobcategory`;
    return await this.dbCon.query(queryAllJobcategorys, ['%' + keyword + '%']);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('jobcard') //✅
  async getRandomCard(@Request() req: any): Promise<any> {
    try {
      return await this.companyService.getRandomJobcard(
        req.user.userid,
        req.user.type,
      );
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('jobcardlist')
  async getJobCardList(@Request() req: any): Promise<any> {
    try {
      return await this.companyService.getJobCardList(req.user.userid);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  //set if user is interested in a jobcard or user
  @UseGuards(AuthenticatedGuard)
  @Post('jobcard') //✅
  async createJobcard(@Request() req: any): Promise<any> {
    try {
      const jobcard: Jobcard = {
        jobtitle: req.body['title'],
        description: req.body['description'],
        jobcategory: req.body['jobcategory'],
        jobtype: req.body['jobtype'],
        userid_fk: req.user.userid,
      };
      return await this.companyService.createJobcard(jobcard);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('jobcard') //✅
  async deleteJobCard(@Request() req: any): Promise<any> {
    try {
      return await this.companyService.deleteJobCard(req.body['jobcardid']);
    } catch (error) {
      return { status: 'failed' };
    }
  }
}
