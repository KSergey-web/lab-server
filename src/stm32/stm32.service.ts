import { Injectable } from '@nestjs/common';
import { CommandHelper } from 'src/share/command-helper.class';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';

@Injectable()
export class Stm32Service {
    constructor(private readonly equipmentFileService: EquipmentFilesService) {}

    async changeButtonStatusByInd(ind: number){
      const buttons: string = CommandHelper.indexToCommand(ind, 1);
      return this.runPhysicalImpactScript(buttons)
    }
  
    async clean(): Promise<Output> {
      const command = 'python C:\\Scripts\\Clean.py';
      const res = await this.equipmentFileService.runScript(command);
      return res;
    }
  
    async runPhysicalImpactScript(
      buttons: string = '0',
    ): Promise<Output> {
      const command =
        'python C:\\Scripts\\Button.py' + ' ' + buttons;
      const res = await this.equipmentFileService.runScript(command);
      return res;
    }
  
  
    async flashFile(file: Express.Multer.File): Promise<Output> {
      await this.clean();
      const filename: string = await this.equipmentFileService.saveFile(file);
      console.log(filename);
      const command = 'python C:\\Scripts\\Prog.py' + ' ' + `C:\\Scripts\\${filename}`;
      const res = await this.equipmentFileService.runScript(command);
      return res;
    }
  
    async reflashFile(): Promise<Output> {
      const filename = await this.equipmentFileService.findSourceFileInWindows(
        'bin',
      );
      console.log('flash file: ', filename);
      const command = 'python C:\\Scripts\\Prog.py' + ' ' + `C:\\Scripts\\${filename}`;
      const res = await this.equipmentFileService.runScript(command);
      return res;
    }
}
