import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class AppService {
  constructor() {}

  // @Cron('0 * 4 * * *')
  // handleCron() {
  //   console.log('Cron job executed');
  // }
}
