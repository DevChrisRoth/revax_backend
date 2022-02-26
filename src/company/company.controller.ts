import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Request,
  Response,
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

  @Get('jobcategorys/:keyword')
  async countJobcategory(
    @Param('keyword') keyword: string,
    @Ip() ip: any,
  ): Promise<any> {
    console.log('IP: ' + ip, 'KEYWORD: ' + keyword);
    if (keyword === 'undefined') {
      const queryAllJobcategorysWithoutKeyword = `SELECT jobcategory, count(jobcategory) as count FROM userdata where jobcategory is not null GROUP BY jobcategory`;
      const res = await this.dbCon.query(queryAllJobcategorysWithoutKeyword);
      console.log({ categories: res });
      return { categories: res };
    } else {
      const queryAllJobcategorys = `SELECT jobcategory, count(jobcategory) as count FROM userdata WHERE jobcategory LIKE ? and jobcategory is not null group by jobcategory`;
      return await this.dbCon.query(queryAllJobcategorys, [
        '%' + keyword + '%',
      ]);
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('jobcard') //✅
  async getRandomCard(@Request() req: any, @Response() res: any): Promise<any> {
    try {
      return res
        .status(200)
        .json(
          await this.companyService.getRandomJobcard(
            req.user.userid,
            req.user.type,
          ),
        );
    } catch (error) {
      return res.status(500).json({ status: 'failed' });
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
  @HttpCode(200)
  @Post('jobcard') //✅
  async createJobcard(@Request() req: any): Promise<any> {
    try {
      const jobcard: Jobcard = {
        jobtitle: req.body['title'],
        description: req.body['description'],
        jobcategory: req.body['jobcategory'],
        userid_fk: req.user.userid,
      };
      return await this.companyService.createJobcard(jobcard);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('jobcard/:id') //✅
  async deleteJobCard(@Param('id') id: string): Promise<any> {
    try {
      return await this.companyService.deleteJobCard(Number(id));
    } catch (error) {
      return { status: 'failed' };
    }
  }
}
