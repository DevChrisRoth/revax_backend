import { Logtail } from '@logtail/node';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
require('dotenv').config();

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  logtail = new Logtail('xxMK2pXiUhkTZdja89E2nGYd');
  async sendUserConfirmation(
    _userid: number,
    _email: string,
    _type: number,
    _name: string,
  ) {
    try {
      this.logtail.info('Neuer User: ' + _name + ' | Email:' + _email);
      const url = `${process.env.REVAX_URL}/confirm/${_userid}`;
      await this.mailerService.sendMail({
        to: _email,
        subject: `Hi ${_name}!👋 Willkommen in der REVAX-Community!`,
        template: 'confirmation', // `.hbs` extension is appended automatically
        context: {
          name: _name,
          url,
        },
      });
    } catch (err) {
      Logger.log(err);
    }
  }
  async sendUserResetPassword(_resetId: number, _email: string) {
    try {
      Logger.log('Email: ' + _email);
      const url = `${process.env.REVAX_URL}/resetpassword/${_resetId}`;
      await this.mailerService.sendMail({
        to: _email,
        subject: `📢 Dein Account benötigt kurz deine Aufmerksamkeit!`,
        template: 'resetpassword', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: 'REVAX-User',
          url,
        },
      });
    } catch (err) {
      Logger.log(err);
    }
  }
}
