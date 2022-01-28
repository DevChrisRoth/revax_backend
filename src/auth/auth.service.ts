import { Injectable, Logger } from '@nestjs/common';
import * as bycript from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsernameAndPassword(email);
    if (user.status === 'failed') return null;
    if (user && bycript.compareSync(password, user.password)) {
      const { email, password, ...result } = user;
      return { type: result.type, userid: result.userid };
    }
    return null;
  }
}
