import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
require('dotenv').config();

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: `${process.env.REVAX_EMAIL_HOSTINGER_HOST}`,
        port: Number(process.env.REVAX_EMAIL_HOSTINGER_PORT),
        secure: true,
        auth: {
          user: `${process.env.REVAX_EMAIL_HOSTINGER_EMAIL}`,
          pass: `${process.env.REVAX_EMAIL_HOSTINGER_PASSWORD}`,
        },
      },
      defaults: {
        from: `"REVAX - Jobs" <${process.env.REVAX_EMAIL_HOSTINGER_EMAIL}> `,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
