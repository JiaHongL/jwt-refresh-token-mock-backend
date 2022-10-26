import { ApiProperty } from '@nestjs/swagger';
import { PostItemDetailDto } from '../_other/post-item-detail.dto';

export class ResultOfPostDetailDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: PostItemDetailDto;

  constructor({ success = true, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
