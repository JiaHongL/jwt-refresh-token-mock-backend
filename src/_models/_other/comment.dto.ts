import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from './user-info.dto';

export class CommentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  body: string;

  @ApiProperty()
  postsId: number;

  @ApiProperty()
  user: UserInfoDto;

  constructor({ id = null, body = '', postsId = null, user = null }) {
    this.id = id;
    this.body = body;
    this.postsId = postsId;
    this.user = user || new UserInfoDto({});
  }
}
