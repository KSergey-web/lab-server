import { Injectable } from '@nestjs/common';
import { CommandHelper } from 'src/share/command-helper.class';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';

@Injectable()
export class AlteraDe1SoCService {
  constructor(private equipmentFileService: EquipmentFilesService) {}
  private _switches: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  private setSwitchesToDefault(): void {
    this._switches = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  get switches(): string {
    return this._switches.join('');
  }

  private set switches(value: string) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i] === '1') this._switches[i] = -this._switches[i] + 1;
    }
  }

  async clean(): Promise<Output> {
    const command = 'python C:\\Scripts\\FPGA_clean.py';
    const res = await this.equipmentFileService.runScript(command);
    this.setSwitchesToDefault();
    return res;
  }

  async turnOffSwitches(): Promise<Output> {
    const command = 'python C:\\Scripts\\FPGA_buttons.py cle 0 0';
    const res = await this.equipmentFileService.runScript(command);
    this.setSwitchesToDefault();
    return res;
  }

  async changeButtonStatusByInd(ind: number) {
    const buttons: string = CommandHelper.indexToCommand(ind, 4);
    return this.runPhysicalImpactScript(undefined, buttons);
  }

  async changeSwitchStatusByInd(ind: number) {
    const switches: string = CommandHelper.indexToCommand(ind, 8);
    return this.runPhysicalImpactScript(switches);
  }

  async runPhysicalImpactScript(
    switches: string = '00000000',
    buttons: string = '0000',
  ): Promise<Output> {
    const command =
      'python C:\\Scripts\\FPGA_buttons.py key' +
      ' ' +
      switches +
      ' ' +
      buttons;
    const res = await this.equipmentFileService.runScript(command);
    this.switches = switches;
    return res;
  }

  async flashFile(file: Express.Multer.File): Promise<Output> {
    await this.clean();
    const filename: string = await this.equipmentFileService.saveFile(file);
    console.log(filename);
    const command = 'python C:\\Scripts\\FPGA_prog.py' + ' ' + `${filename}`;
    const res = await this.equipmentFileService.runScript(command);
    this.setSwitchesToDefault();
    return res;
  }

  async reflashFile(): Promise<Output> {
    const filename = await this.equipmentFileService.findSourceFileInWindows(
      'sof',
    );
    console.log('flash file: ', filename);
    const command = 'python C:\\Scripts\\FPGA_prog.py' + ' ' + `${filename}`;
    const res = await this.equipmentFileService.runScript(command);
    this.setSwitchesToDefault();
    return res;
  }
}
