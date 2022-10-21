import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: ['accessToken', 'refreshToken'],
    }),
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, AccessStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
