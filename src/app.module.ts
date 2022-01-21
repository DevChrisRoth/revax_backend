import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CompanyService } from './company/company.service';
import { Jobcard } from './company/Jobcard.entity';
import config from './ormconfig';
import { UserData } from './users/UserData.entity';
import { UserLogin } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { PossibleMatchesService } from './possible-matches/possible-matches.service';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { MessageModule } from './message/message.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([UserData, UserLogin, Jobcard]),

    RateLimiterModule,

    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, CompanyService, PossibleMatchesService],
})
export class AppModule {}
