import { Injectable } from '@nestjs/common';
import { CommandHelper } from 'src/share/command-helper.class';
import { IEquipmentDTO } from 'src/share/dto/equipment.dto';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';
import { EquipmentsStoreService } from 'src/share/services/equipments-store.service';
import { ScriptQueueService } from 'src/share/services/script-queue.service';
import { AlteraDe1SoC } from './altera-de1-so-c.class';

@Injectable()
export class AlteraDe1SoCService {
  constructor(
    private equipmentFileService: EquipmentFilesService,
    private readonly equipmentsStoreService: EquipmentsStoreService,
    private readonly scriptQueueService: ScriptQueueService,
  ) {}

  private setSwitchesToDefault(equipmentId: number): void {
    const device = this.equipmentsStoreService.getEquipment(
      equipmentId,
    ) as AlteraDe1SoC;
    device.setSwitchesToDefault();
  }

  getSwitches(equipmentId: number): string {
    const device = this.equipmentsStoreService.getEquipment(
      equipmentId,
    ) as AlteraDe1SoC;
    return device.switches;
  }

  private setSwitchesValue(switches: string, equipmentId: number): void {
    const device = this.equipmentsStoreService.getEquipment(
      equipmentId,
    ) as AlteraDe1SoC;
    device.switches = switches;
  }

  async clean(deviceInfo: IEquipmentDTO): Promise<Output> {
    const command = [
      'python C:\\Scripts\\FPGA_clean.py',
      deviceInfo.devicePort,
    ].join(' ');
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    this.setSwitchesToDefault(deviceInfo.id);
    return res;
  }

  async turnOffSwitches(deviceInfo: IEquipmentDTO): Promise<Output> {
    const command = [
      'python C:\\Scripts\\FPGA_buttons.py cle 0 0',
      deviceInfo.arduinoPort,
    ].join(' ');
    const res = await this.scriptQueueService.runScript(
      command,
      deviceInfo.id,
      false,
    );
    this.setSwitchesToDefault(deviceInfo.id);
    return res;
  }

  async changeButtonStatusByInd(ind: number, deviceInfo: IEquipmentDTO) {
    const buttons: string = CommandHelper.indexToCommand(ind, 4);
    return this.runPhysicalImpactScript({ buttons, deviceInfo });
  }

  async changeSwitchStatusByInd(ind: number, deviceInfo: IEquipmentDTO) {
    const switches: string = CommandHelper.indexToCommand(ind, 8);
    const res = this.runPhysicalImpactScript({ switches, deviceInfo });
    this.setSwitchesValue(switches, deviceInfo.id);
    return res;
  }

  async runPhysicalImpactScript({
    switches = '00000000',
    buttons = '0000',
    deviceInfo,
  }: {
    buttons?: string;
    switches?: string;
    deviceInfo: IEquipmentDTO;
  }): Promise<Output> {
    const command = [
      'python C:\\Scripts\\FPGA_buttons.py key',
      switches,
      buttons,
      deviceInfo.arduinoPort,
    ].join(' ');
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    return res;
  }

  async flashFile(
    file: Express.Multer.File,
    deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    await this.clean(deviceInfo);
    const filepath: string = await this.equipmentFileService.saveFile(file);
    console.log(filepath);
    const command =
      'python C:\\Scripts\\FPGA_prog.py' +
      ' ' +
      `${filepath}` +
      ' ' +
      deviceInfo.devicePort;
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    this.setSwitchesToDefault(deviceInfo.id);
    return res;
  }

  async reflashFile(deviceInfo: IEquipmentDTO): Promise<Output> {
    const filePath = await this.equipmentFileService.findSourceFileInWindows(
      'sof',
    );
    console.log('flash file: ', filePath);
    const command =
      'python C:\\Scripts\\FPGA_prog.py' +
      ' ' +
      `${filePath}` +
      ' ' +
      deviceInfo.devicePort;
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    this.setSwitchesToDefault(deviceInfo.id);
    return res;
  }
}
