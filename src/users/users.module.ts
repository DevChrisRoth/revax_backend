import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { ResetPassword } from './reset.entity';
import { UserData } from './userdata.entity';
import { UsersController } from './users.controller';
import { UserLogin } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin, UserData, ResetPassword]),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    MailModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
