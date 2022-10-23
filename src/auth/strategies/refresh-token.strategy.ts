import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { jwtRefreshConstants } from './constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtRefreshConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.username);

    if (!user) {
      throw new HttpException('拒絕訪問', HttpStatus.FORBIDDEN);
    }

    return { userId: payload.sub, username: payload.username };
  }
}
