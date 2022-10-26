import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { ResultOfErrorDto } from 'src/_models/result/result-of-error.dto';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.username);

    if (!user) {
      const result = new ResultOfErrorDto({
        message: '拒絕訪問',
      });
      throw new HttpException(result, HttpStatus.FORBIDDEN);
    }

    return { userId: payload.sub, username: payload.username };
  }
}
