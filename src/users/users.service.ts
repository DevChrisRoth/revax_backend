import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLogin } from './users.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserLogin)
    private UserLoginRepository: Repository<UserLogin>,
  ) {}

  async findByUsernameAndPassword(email: string): Promise<UserLogin> {
    return await this.UserLoginRepository.findOne({
      select: ['type', 'email', 'password', 'hash', 'userid'],
      where: {
        email: email,
      },
    });
  }
}
