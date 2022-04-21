import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';

@Injectable()
export class AlteraDe1SoCInterceptor implements NestInterceptor {
  constructor(private readonly alteraDe1SoCService: AlteraDe1SoCService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((output) =>
          output.switches
            ? output
            : (output.switches = this.alteraDe1SoCService.switches),
        ),
      );
  }
}
