import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException ? exception.message : 'Internal server error';

        const stack = exception instanceof Error ? exception.stack : undefined;

        this.logger.error(
            `[${request.method}] ${request.url} → ${status}: ${message}`,
            stack,
            'ExceptionFilter',
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
