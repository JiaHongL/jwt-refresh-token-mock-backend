import { ApiProperty } from '@nestjs/swagger';

export class RefreshBodyDto {
  @ApiProperty()
  refreshToken: string;
}
