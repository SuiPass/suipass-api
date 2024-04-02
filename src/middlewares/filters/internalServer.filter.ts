import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import { ErrorResponseDto } from 'src/domain';

@Catch(Error)
export class InternalServerFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const resp = host.switchToHttp().getResponse<Response>();
    resp
      .status(HttpStatusCode.InternalServerError)
      .json(new ErrorResponseDto(exception.message));
  }
}
