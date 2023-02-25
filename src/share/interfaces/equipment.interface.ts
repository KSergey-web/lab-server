import { devicePortType } from './device-port.type';

export interface IEquipment {
  id: number;

  devicePort?: devicePortType;

  arduinoPort?: devicePortType;
}
