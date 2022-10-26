import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ResultOfErrorDto } from './_models/result/result-of-error.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody = new ResultOfErrorDto({
      message: exception.message,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, exception.getStatus());
  }
}
