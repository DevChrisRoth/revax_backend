import { Logtail } from '@logtail/node';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class AppService {
  constructor() {}
  // logtail = new Logtail('xxMK2pXiUhkTZdja89E2nGYd');

  // @Cron('0 * 4 * * *')
  // handleCron() {
  //   console.log('Cron job executed');
  //   this.logtail.info('Cron job executed');
  // }
}
