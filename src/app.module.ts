import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CompanyService } from './company/company.service';
import { Jobcard } from './company/Jobcard.entity';
import { Chatroom } from './message/chatroom.entity';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/message.service';
import { Messages } from './message/messages.entity';
import config from './ormconfig';
import { PossibleMatches } from './possible-matches/possible-matches.entity';
import { PossibleMatchesService } from './possible-matches/possible-matches.service';
import { UserData } from './users/UserData.entity';
import { UserLogin } from './users/users.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
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

    RateLimiterModule,

    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    CompanyService,
    PossibleMatchesService,
    MessageService,
  ],
})
export class AppModule {}
