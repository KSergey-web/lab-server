import { FactoryEquipment } from 'src/share/classes/factory.equipment.abstract';
import { devicePortType } from 'src/share/interfaces/device-port.type';
import { IEquipment } from 'src/share/interfaces/equipment.interface';

export class AlteraDe1SoCFactory extends FactoryEquipment {
  override createEquipment(): IEquipment {
    return new AlteraDe1SoC(this.equipmentData);
  }
}

export class AlteraDe1SoC implements IEquipment {
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

  private _switches: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  setSwitchesToDefault(): void {
    this._switches = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  get switches(): string {
    return this._switches.join('');
  }

  set switches(value: string) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i] === '1') this._switches[i] = -this._switches[i] + 1;
    }
  }
}
