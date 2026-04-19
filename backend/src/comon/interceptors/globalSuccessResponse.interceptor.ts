import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        const { message, refreshToken, ...rest } = data ?? {};
        return {
          success: true,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: message ?? 'Request successful',
          data: rest?.data !== undefined ? rest.data : rest,
          path: request.url,
          method: request.method,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
