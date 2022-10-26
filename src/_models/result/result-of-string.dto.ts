import { ApiProperty } from '@nestjs/swagger';

export class ResultOfStringDto<TData = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: TData;

  constructor({ success = true, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
