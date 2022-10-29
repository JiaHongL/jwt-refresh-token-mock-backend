import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { jwtConstants, jwtRefreshConstants } from './strategies/constants';

import { ResultOfLoginSuccessfullyDto } from 'src/_models/result/result-of-login-successfully.dto';

@Injectable()
export class AuthService {
  /** access token 過期時間 */
  accessTokenExpiresIn = '30s';

  /** refresh token 過期時間 */
  refreshTokenExpiresIn = '7d';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<ResultOfLoginSuccessfullyDto> {
    const userInfo = await this.usersService.findOne(user.username);

    const payload = { username: user.username, sub: userInfo.userId };

    const [accessToken, refreshToken] = await this.createTokens(payload);

    const result = new ResultOfLoginSuccessfullyDto({
      data: {
        accessToken,
        refreshToken,
      },
    });

    return result;
  }

  async refreshToken(user) {

    const userInfo = await this.usersService.findOne(user.username);

    const payload = { username: user.username, sub: userInfo.userId };

    const [accessToken, refreshToken] = await this.createTokens(payload);

    const result = new ResultOfLoginSuccessfullyDto({
      data: {
        accessToken,
        refreshToken,
      },
    });

    return result;
  }

  createTokens(payload): any {
    return Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: this.accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtRefreshConstants.secret,
        expiresIn: this.refreshTokenExpiresIn,
      }),
    ]);
  }
}
