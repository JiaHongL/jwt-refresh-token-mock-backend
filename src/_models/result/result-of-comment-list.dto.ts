import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { CommentDto } from '../_other/comment.dto';

@ApiExtraModels(CommentDto)
export class ResultOfCommentListDetailDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        {
          $ref: getSchemaPath(CommentDto),
        },
      ],
    },
  })
  data: CommentDto[];

  constructor({ success = true, message = '', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
