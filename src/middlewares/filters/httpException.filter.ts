import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from 'src/domain';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.error(exception);
    const resp = host.switchToHttp().getResponse<Response>();

    const expResp = exception.getResponse();
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
