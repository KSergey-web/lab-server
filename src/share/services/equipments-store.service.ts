import { Injectable } from '@nestjs/common';
import { FactoryEquipment } from '../classes/factory.equipment.abstract';
import { IEquipment } from '../interfaces/equipment.interface';

@Injectable()
export class EquipmentsStoreService {
  private _equipments = new Map<number, IEquipment>();

  getEquipment(id: number): IEquipment {
    return this._equipments.get(id);
  }

  setEquipment(id: number, equipment: IEquipment): void {
    this._equipments.set(id, equipment);
  }

  resolveEquipment(
    equipmentId: number,
    conditionForRecreating: (equipment: IEquipment) => boolean,
    obj: FactoryEquipment,
  ) {
    let equipment = this._equipments.get(equipmentId);
    if (!equipment || conditionForRecreating(equipment)) {
      equipment = obj.createEquipment();
      this._equipments.set(equipmentId, equipment);
    }
    return equipment;
  }
}
