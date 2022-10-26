import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from './user-info.dto';

export class PostItemDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  cover: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  user: UserInfoDto;

  constructor({
    id = null,
    postId = null,
    title = '',
    body = '',
    cover = '',
    tags = [],
    user = null,
  }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.cover = cover;
    this.tags = tags;
    this.postId = postId;
    this.user = user || new UserInfoDto({});
  }
}
