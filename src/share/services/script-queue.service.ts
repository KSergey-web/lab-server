import { Injectable } from '@nestjs/common';
import { lastValueFrom, Observable, ReplaySubject } from 'rxjs';
import { IEquipment } from '../interfaces/equipment.interface';
import { Output } from '../response/output.interface';
import { EquipmentFilesService } from './equipment-files.service';
import { EquipmentsStoreService } from './equipments-store.service';

@Injectable()
export class ScriptQueueService {
  constructor(
    private readonly equipmentFileService: EquipmentFilesService,
    private readonly equipmentsStoreService: EquipmentsStoreService,
  ) {}

  private lastCommandNotifyerMap = new WeakMap<
    IEquipment,
    Observable<unknown>
  >();

  async runScript(command: string, equipmentId: number): Promise<Output> {
    const equipment = this.equipmentsStoreService.getEquipment(equipmentId);
    const lastCommandExecution = this.lastCommandNotifyerMap.get(equipment);
    const commandEndNotifier = new ReplaySubject(1);
    this.lastCommandNotifyerMap.set(equipment, commandEndNotifier);
    if (lastCommandExecution) {
      await lastValueFrom(lastCommandExecution);
    }
    try {
      const res = await this.equipmentFileService.runScript(command);
      return res;
    } finally {
      commandEndNotifier.next(true);
      commandEndNotifier.complete();
    }
  }
}
