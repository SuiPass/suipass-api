import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import { ErrorResponseDto } from 'src/domain';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    console.log('asldkajkdajs');
    const resp = host.switchToHttp().getResponse<Response>();
    return resp
      .status(HttpStatusCode.BadRequest)
      .json(new ErrorResponseDto(exception.message, exception.errors));
  }
}
