import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { IEquipmentDTO } from 'src/share/dto/equipment.dto';
import { IEquipment } from 'src/share/interfaces/equipment.interface';
import { Output } from 'src/share/response/output.interface';
import { EquipmentsStoreService } from 'src/share/services/equipments-store.service';
import { STK500, STK500Factory } from './stk500.class';

@Injectable()
export class Stk500Interceptor implements NestInterceptor {
  constructor(
    private readonly equipmentsStoreService: EquipmentsStoreService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Output> {
    const query = context.switchToHttp().getRequest<Request>().query;
    const equipmentData = plainToClass(IEquipmentDTO, query);
    const stk500 = this.equipmentsStoreService.resolveEquipment(
      equipmentData.id,
      (equipment: IEquipment) =>
        !(equipment instanceof STK500) ||
        equipment.arduinoPort !== equipmentData.arduinoPort ||
        equipment.devicePort !== equipmentData.devicePort,
      new STK500Factory(equipmentData),
    ) as STK500;
    return next.handle().pipe(
      map((output) => {
        output.resistor = stk500.resistor;
        return output;
      }),
    );
  }
}
