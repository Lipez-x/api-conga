import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    response.status(status).json({
      timestamps: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
