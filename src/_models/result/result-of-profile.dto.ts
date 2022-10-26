import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from '../_other/user-info.dto';

export class ResultOfProfileDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: UserInfoDto;

  constructor({ success = true, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
