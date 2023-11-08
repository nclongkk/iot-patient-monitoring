import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const { statusCode } = response;

    return next.handle().pipe(
      map((data) => {
        if (statusCode >= 200 && statusCode < 300) {
          return { data, status: 'success' };
        } else {
          return { error: data, status: 'error' };
        }
      }),
    );
  }
}
