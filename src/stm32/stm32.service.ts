import { Injectable } from '@nestjs/common';
import { CommandHelper } from 'src/share/command-helper.class';
import { IEquipmentDTO } from 'src/share/dto/equipment.dto';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';
import { ScriptQueueService } from 'src/share/services/script-queue.service';

@Injectable()
export class Stm32Service {
  constructor(
    private readonly scriptQueueService: ScriptQueueService,
    private readonly equipmentFileService: EquipmentFilesService,
  ) {}

  async changeButtonStatusByInd(ind: number, deviceInfo: IEquipmentDTO) {
    const buttons: string = CommandHelper.indexToCommand(ind, 1);
    return this.runPhysicalImpactScript(buttons, deviceInfo);
  }

  async clean(deviceInfo: IEquipmentDTO): Promise<Output> {
    const command = 'python C:\\Scripts\\Clean.py';
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    return res;
  }

  async runPhysicalImpactScript(
    buttons = '0',
    deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    const command = 'python C:\\Scripts\\Button.py' + ' ' + buttons;
    const res = await this.scriptQueueService.runScript(
      command,
      deviceInfo.id,
      false,
    );
    return res;
  }

  async flashFile(
    file: Express.Multer.File,
    deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    await this.clean(deviceInfo);
    const filePath: string = await this.equipmentFileService.saveFile(file);
    const command = [
      'python C:\\Scripts\\Prog.py',
      filePath,
      deviceInfo.devicePort,
    ].join(' ');
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    return res;
  }

  async reflashFile(deviceInfo: IEquipmentDTO): Promise<Output> {
    const filePath = await this.equipmentFileService.findSourceFileInWindows(
      'bin',
    );
    console.log('flash file: ', filePath);
    const command = [
      'python C:\\Scripts\\Prog.py',
      filePath,
      deviceInfo.devicePort,
    ].join(' ');
    const res = await this.scriptQueueService.runScript(command, deviceInfo.id);
    return res;
  }
}
