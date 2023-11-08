import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let responseMessage = 'Lỗi hệ thống';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { message } = exception.getResponse() as any;

    if (typeof message === 'string') {
      responseMessage = message;
    } else {
      responseMessage = message[0];
    }

    response.status(status).json({
      statusCode: status,
      message: responseMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
