import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable({})
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); //config
  }

  async validate(
    _email: string,
    _password: string,
  ): Promise<{
    type: any;
    userid: any;
  }> {
    const user = await this.authService.validateUser(_email, _password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
