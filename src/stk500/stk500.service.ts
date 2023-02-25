import { Injectable } from '@nestjs/common';
import { CommandHelper } from 'src/share/command-helper.class';
import { IEquipmentDTO } from 'src/share/dto/equipment.dto';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';
import { EquipmentsStoreService } from 'src/share/services/equipments-store.service';
import { ScriptQueueService } from 'src/share/services/script-queue.service';
import { STK500 } from './stk500.class';

@Injectable()
export class Stk500Service {
  constructor(
    private readonly equipmentsStoreService: EquipmentsStoreService,
    private readonly scriptQueueService: ScriptQueueService,
    private readonly equipmentFileService: EquipmentFilesService,
  ) {}

  private setResistorMin(equipmentId: number): void {
    const device = this.equipmentsStoreService.getEquipment(
      equipmentId,
    ) as STK500;
    device.setResistorMin();
  }

  private setResistorValue(resistor: number, equipmentId: number) {
    const device = this.equipmentsStoreService.getEquipment(
      equipmentId,
    ) as STK500;
    device.resistor = resistor;
  }

  getResistorValue(equipmentId: number): number {
    const device = this.equipmentsStoreService.getEquipment(
      equipmentId,
    ) as STK500;
    return device.resistor;
  }

  async changeButtonStatusByInd(ind: number, deviceInfo: IEquipmentDTO) {
    const buttons: string = CommandHelper.indexToCommand(ind, 8);
    return this.runPhysicalImpactScript({ buttons, deviceInfo });
  }

  async changeResistorStatus(resistorValue: number, deviceInfo: IEquipmentDTO) {
    const resistor: string = this.valueResistorToCommand(resistorValue);
    const res = this.runPhysicalImpactScript({ resistor, deviceInfo });
    this.setResistorValue(resistorValue, deviceInfo.id);
    return res;
  }

  async clean(deviceInfo: IEquipmentDTO): Promise<Output> {
    const command =
      'python C:\\Scripts\\STK_clean.py' + ' ' + deviceInfo.devicePort;
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    this.setResistorMin(deviceInfo.id);
    return res;
  }

  async runPhysicalImpactScript({
    buttons = '00000000',
    resistor = '00000',
    deviceInfo,
  }: {
    buttons?: string;
    resistor?: string;
    deviceInfo: IEquipmentDTO;
  }): Promise<Output> {
    const command = [
      'echo comm',
      buttons,
      resistor,
      '>',
      `COM${deviceInfo.arduinoPort ?? 5}`,
    ].join(' ');
    const res = await this.scriptQueueService.runScript(
      command,
      deviceInfo.id,
      false,
    );
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
    deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    await this.clean(deviceInfo);
    const filePath: string = await this.equipmentFileService.saveFile(file);
    const command =
      'python C:\\Scripts\\STK_prog.py' +
      ' ' +
      filePath +
      ' ' +
      deviceInfo.devicePort;
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    this.setResistorMin(deviceInfo.id);
    return res;
  }

  async reflashFile(deviceInfo: IEquipmentDTO): Promise<Output> {
    const filepath = await this.equipmentFileService.findSourceFileInWindows(
      'hex',
    );
    console.log('flash file: ', filepath);
    const command =
      'python C:\\Scripts\\STK_prog.py' +
      ' ' +
      filepath +
      ' ' +
      deviceInfo.devicePort;
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    this.setResistorMin(deviceInfo.id);
    return res;
  }
}
