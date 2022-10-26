import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from './user-info.dto';

export class PostItemDto {
  @ApiProperty()
  id: number;

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
    title = '',
    body = '',
    cover = '',
    tags = [],
    user: {},
  }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.cover = cover;
    this.tags = tags;
    this.user = this.user || new UserInfoDto({});
  }
}
