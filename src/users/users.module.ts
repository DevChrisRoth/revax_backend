import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogin } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin]),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
