import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { DeviceInfoDTO } from 'src/share/dto/device-info.dto';
import { Stk500Service } from './stk500.service';

@Injectable()
export class Stk500Interceptor implements NestInterceptor {
  constructor(private readonly stk500Service: Stk500Service) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const query = context.switchToHttp().getRequest<Request>().query;
    const { devicePort } = plainToClass(DeviceInfoDTO, query);
    return next.handle().pipe(
      map((output) => {
        output.resistor = this.stk500Service.getResistorValueByPort(devicePort);
        return output;
      }),
    );
  }
}
