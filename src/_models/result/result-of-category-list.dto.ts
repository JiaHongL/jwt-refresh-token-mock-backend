import { ApiProperty } from '@nestjs/swagger';

export class ResultOfCategoryListDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  data: string[];

  constructor({ success = true, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
