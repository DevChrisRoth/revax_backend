import { Logtail } from '@logtail/node';
import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  logtail = new Logtail('xxMK2pXiUhkTZdja89E2nGYd');

  @Get('logtail')
  testForLogtail(@Res() res) {
    this.logtail.info('API Request for Logtail');
    return res.status(200).json({ message: 'API Request for' });
  }
}
