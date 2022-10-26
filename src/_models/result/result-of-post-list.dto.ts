import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { PostItemDto } from '../_other/post-item.dto';

@ApiExtraModels(PostItemDto)
export class ResultOfPostListDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        {
          $ref: getSchemaPath(PostItemDto),
        },
      ],
    },
  })
  data: PostItemDto[];

  constructor({ success = true, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
