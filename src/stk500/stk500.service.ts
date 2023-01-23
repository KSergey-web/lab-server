import { Injectable } from '@nestjs/common';
import { CommandHelper } from 'src/share/command-helper.class';
import { IDeviceInfo } from 'src/share/interfaces/device-info.interface';
import { devicePortType } from 'src/share/interfaces/device-port.type';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';
import { STK500 } from './stk500.class';

@Injectable()
export class Stk500Service {
  constructor(private readonly equipmentFileService: EquipmentFilesService) {}

  private devices = new Map<devicePortType, STK500>();

  private setResistorMin(devicePort: devicePortType): void {
    const device = this.checkExistAndGetDeviceByPort(devicePort);
    device.setResistorMin();
  }

  private setResistorValueByComPort(
    resistor: number,
    devicePort: devicePortType,
  ) {
    const device = this.checkExistAndGetDeviceByPort(devicePort);
    device.resistor = resistor;
  }

  getResistorValueByPort(devicePort: devicePortType): number {
    const device = this.checkExistAndGetDeviceByPort(devicePort);
    return device.resistor;
  }

  checkExistAndGetDeviceByPort(devicePort): STK500 {
    const device = this.devices.get(devicePort);
    if (device) return device;
    const newDevice = STK500.factoryMethod();
    this.devices.set(devicePort, newDevice);
    return newDevice;
  }

  async changeButtonStatusByInd(ind: number, deviceInfo: IDeviceInfo) {
    const buttons: string = CommandHelper.indexToCommand(ind, 8);
    return this.runPhysicalImpactScript({ buttons, deviceInfo });
  }

  async changeResistorStatus(resistorValue: number, deviceInfo: IDeviceInfo) {
    const resistor: string = this.valueResistorToCommand(resistorValue);
    const res = this.runPhysicalImpactScript({ resistor, deviceInfo });
    this.setResistorValueByComPort(resistorValue, deviceInfo.devicePort);
    return res;
  }

  async clean(devicePort: devicePortType): Promise<Output> {
    const command = 'python C:\\Scripts\\STK_clean.py' + ' ' + devicePort;
    const res = await this.equipmentFileService.runScript(command);
    this.setResistorMin(devicePort);
    return res;
  }

  async runPhysicalImpactScript({
    buttons = '00000000',
    resistor = '00000',
    deviceInfo,
  }: {
    buttons?: string;
    resistor?: string;
    deviceInfo: IDeviceInfo;
  }): Promise<Output> {
    const command = [
      'python C:\\Scripts\\STK_but_adc.py',
      buttons,
      resistor,
      deviceInfo.arduinoPort,
    ].join(' ');
    const res = await this.equipmentFileService.runScript(command);
    return res;
  }

  valueResistorToCommand(value: number): string {
    let command = '10000';
    const strValue = value.toString();
    const lenght = strValue.length;
    command = command.slice(0, 5 - lenght) + strValue;
    return command;
  }

  async flashFile(
    file: Express.Multer.File,
    devicePort: devicePortType,
  ): Promise<Output> {
    await this.clean(devicePort);
    const filename: string = await this.equipmentFileService.saveFile(file);
    console.log(filename);
    const command =
      'python C:\\Scripts\\STK_prog.py' + ' ' + filename + ' ' + devicePort;
    const res = await this.equipmentFileService.runScript(command);
    this.setResistorMin(devicePort);
    return res;
  }

  async reflashFile(devicePort: devicePortType): Promise<Output> {
    const filename = await this.equipmentFileService.findSourceFileInWindows(
      'hex',
    );
    console.log('flash file: ', filename);
    const command =
      'python C:\\Scripts\\STK_prog.py' + ' ' + filename + ' ' + devicePort;
    const res = await this.equipmentFileService.runScript(command);
    this.setResistorMin(devicePort);
    return res;
  }
}
