import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResultOfErrorDto } from 'src/_models/result/result-of-error.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      const result = new ResultOfErrorDto({
        message: '登入失敗，請確認帳密是否正確',
      });
      throw new HttpException(result, HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
