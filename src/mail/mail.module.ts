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
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: `${process.env.REVAX_EMAIL_HOST}`,
        port: Number(process.env.REVAX_EMAIL_PORT),
        secure: true,
        auth: {
          user: `${process.env.REVAX_EMAIL}`,
          pass: `${process.env.REVAX_EMAIL_PASSWORD}`,
        },
      },
      defaults: {
        from: `"REVAX - Jobs" <${process.env.REVAX_EMAIL}> `,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
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
