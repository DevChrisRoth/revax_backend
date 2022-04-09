import { Injectable } from '@nestjs/common';
import * as bycript from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    _email: string,
    _password: string,
  ): Promise<{
    type: any;
    userid: any;
  }> {
    const user = await this.usersService.findByUsernameAndPassword(_email);
    if (user.status === 'failed') return null;
    if (user && bycript.compareSync(_password, user.password)) {
      const { email, password, ...result } = user;
      return { type: result.type, userid: result.userid };
    }
    return null;
  }
}
