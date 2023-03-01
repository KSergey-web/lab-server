import { devicePortType } from '../interfaces/device-port.type';
import { IEquipment } from '../interfaces/equipment.interface';

export abstract class FactoryEquipment {
  constructor(
    protected equipmentData: {
      id: number;
      devicePort?: devicePortType;
      arduinoPort?: devicePortType;
    },
  ) {}
  abstract createEquipment(): IEquipment;
}
