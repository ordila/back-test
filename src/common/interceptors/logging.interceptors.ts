import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    const now = Date.now();
    this.logger.log(`Incoming request: ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Request completed: ${method} ${url} - ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
