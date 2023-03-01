import { FactoryEquipment } from 'src/share/classes/factory.equipment.abstract';
import { devicePortType } from 'src/share/interfaces/device-port.type';
import { IEquipment } from 'src/share/interfaces/equipment.interface';

export class STM32Factory extends FactoryEquipment {
  override createEquipment(): IEquipment {
    return new STM32(this.equipmentData);
  }
}

export class STM32 implements IEquipment {
  constructor({
    id,
    devicePort,
    arduinoPort,
  }: {
    id: number;
    devicePort?: devicePortType;
    arduinoPort?: devicePortType;
  }) {
    this._id = id;
    this._devicePort = devicePort;
    this._arduinoPort = arduinoPort;
  }

  updateEquipmentInfo({
    devicePort,
    arduinoPort,
  }: {
    devicePort?: devicePortType;
    arduinoPort?: devicePortType;
  }) {
    this._devicePort = devicePort;
    this._arduinoPort = arduinoPort;
  }

  private _id: number;
  private _devicePort?: devicePortType;
  private _arduinoPort?: devicePortType;

  get devicePort(): devicePortType | undefined {
    return this._devicePort;
  }

  get arduinoPort(): devicePortType | undefined {
    return this._arduinoPort;
  }

  get id(): number {
    return this._id;
  }
}
