import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Stk500Service } from './stk500.service';

@Injectable()
export class Stk500Interceptor implements NestInterceptor {
  constructor(private readonly stk500Service: Stk500Service) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((output) => {
          output.resistor = this.stk500Service.resistor;
          return output;
        }),
      );
  }
}
