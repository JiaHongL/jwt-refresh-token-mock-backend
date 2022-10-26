import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from '../_other/tokens.dto';

export class ResultOfRefreshFailedDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: TokensDto;

  constructor({ success = false, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
