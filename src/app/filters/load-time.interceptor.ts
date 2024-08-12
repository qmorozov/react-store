import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppRequest, AppResponse } from '../models/request';

export class LoadTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: AppRequest = context.switchToHttp().getRequest();
    const res: AppResponse = context.switchToHttp().getResponse();
    const url = req.url;
    const st = Date.now();
    req.timeLabel = res.timeLabel = (label: string) => console.log(`[${url}] ${label} : ${Date.now() - st}ms`);
    return next.handle().pipe(tap(() => req.timeLabel('end')));
  }
}
