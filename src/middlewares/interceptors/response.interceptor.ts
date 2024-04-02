import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AnyDataResponseDto,
  MessageResponseDto,
  OkResponseDto,
  ResponseDto,
} from 'src/domain';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<ResponseDto> | Promise<Observable<ResponseDto>> {
    return next.handle().pipe(
      tap(() => new OkResponseDto()),
      map((data) => {
        if (typeof data == 'string') {
          return new MessageResponseDto(data);
        }

        return new AnyDataResponseDto(data);
      }),
    );
  }
}
