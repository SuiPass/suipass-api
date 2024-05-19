import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from 'src/domain';
import { ZodError } from 'zod';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const resp = host.switchToHttp().getResponse<Response>();

    const expResp = exception.getResponse();

    if (exception instanceof ZodError) {
      return resp
        .status(exception.getStatus())
        .json(new ErrorResponseDto(exception.message, exception.errors));
    }

    if (typeof expResp === 'object') {
      const msg = expResp['message'];
      if (typeof msg === 'string') {
        return resp
          .status(exception.getStatus())
          .json(new ErrorResponseDto(msg));
      }

      const exceptionMsgs = Object.values(msg);
      return resp
        .status(exception.getStatus())
        .json(new ErrorResponseDto(exceptionMsgs[0] as string));
    }

    return resp
      .status(exception.getStatus())
      .json(new ErrorResponseDto(exception.message));
  }
}
