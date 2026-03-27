import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url } = request;
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const ms = Date.now() - start;
                this.logger.log(`[${method}] ${url} — ${ms}ms`, 'HTTP');
            }),
        );
    }
}
