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
import { EquipmentsStoreService } from 'src/share/services/equipments-store.service';
import { AlteraDe1SoC, AlteraDe1SoCFactory } from './altera-de1-so-c.class';

@Injectable()
export class AlteraDe1SoCInterceptor implements NestInterceptor {
  constructor(
    private readonly equipmentsStoreService: EquipmentsStoreService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const query = context.switchToHttp().getRequest<Request>().query;
    const equipmentData = plainToClass(IEquipmentDTO, query);
    const altera = this.equipmentsStoreService.resolveEquipment(
      equipmentData.id,
      (equipment: IEquipment) =>
        !(equipment instanceof AlteraDe1SoC) ||
        equipment.arduinoPort !== equipmentData.arduinoPort ||
        equipment.devicePort !== equipmentData.devicePort,
      new AlteraDe1SoCFactory(equipmentData),
    ) as AlteraDe1SoC;
    return next.handle().pipe(
      map((output) => {
        output.switches = altera.switches;
        return output;
      }),
    );
  }
}
