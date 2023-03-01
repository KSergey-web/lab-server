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
import { STM32, STM32Factory } from './stm32.class';

@Injectable()
export class Stm32Interceptor implements NestInterceptor {
  constructor(
    private readonly equipmentsStoreService: EquipmentsStoreService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Output> {
    const query = context.switchToHttp().getRequest<Request>().query;
    const equipmentData = plainToClass(IEquipmentDTO, query);
    const stm32 = this.equipmentsStoreService.resolveEquipment(
      equipmentData.id,
      (equipment: IEquipment) =>
        !(equipment instanceof STM32) ||
        equipment.arduinoPort !== equipmentData.arduinoPort ||
        equipment.devicePort !== equipmentData.devicePort,
      new STM32Factory(equipmentData),
    ) as STM32;
    return next.handle().pipe(
      map((output) => {
        return output;
      }),
    );
  }
}
