import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor({ accessToken = '', refreshToken = '' }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
