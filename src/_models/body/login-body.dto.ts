import { ApiProperty } from '@nestjs/swagger';

export class LoginBodyDto {
  @ApiProperty({
    default: 'joe',
  })
  username: string;

  @ApiProperty({
    default: 'test',
  })
  password: string;
}
