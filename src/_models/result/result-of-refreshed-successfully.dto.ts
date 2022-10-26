import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from '../_other/tokens.dto';

export class ResultOfRefreshedSuccessfullyDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: TokensDto;

  constructor({
    success = true,
    message = '',
    data = {
      accessToken: '',
      refreshToken: '',
    },
  }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
