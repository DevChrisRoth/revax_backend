import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CompanyController } from './company/company.controller';
import { CompanyService } from './company/company.service';
import { Jobcard } from './company/jobcard.entity';
import { MailModule } from './mail/mail.module';
import { Chatroom } from './message/chatroom.entity';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { Messages } from './message/messages.entity';
import config from './ormconfig';
import { PossibleMatchesController } from './possible-matches/possible-matches.controller';
import { PossibleMatches } from './possible-matches/possible-matches.entity';
import { PossibleMatchesService } from './possible-matches/possible-matches.service';
import { UserData } from './users/userdata.entity';
import { UsersController } from './users/users.controller';
import { UserLogin } from './users/users.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([
      UserData,
      UserLogin,
      Jobcard,
      PossibleMatches,
      Messages,
      Chatroom,
    ]),
    MailModule,
  ],
  controllers: [
    AppController,
    UsersController,
    CompanyController,
    PossibleMatchesController,
    MessageController,
  ],
  providers: [
    AppService,
    AuthService,
    CompanyService,
    PossibleMatchesService,
    MessageService,
  ],
})
export class AppModule {}
