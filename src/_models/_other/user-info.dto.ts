import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar: string;

  constructor({ id = null, username = '', avatar = '' }) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
  }
}
