import { ApiProperty } from '@nestjs/swagger';

export class ResultOfErrorDto {
  @ApiProperty({
    default: false,
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;

  constructor({ success = false, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
