import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as util from 'util';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Output } from 'src/share/response/output.interface';
import { EquipmentFilesService } from 'src/share/services/equipment-files.service';

@Injectable()
export class Stk500Service {

  constructor(private equipmentFileService: EquipmentFilesService){

  }
  
  private _resistor: number = 32;

  private setResistorMin(): void{
    this._resistor = 32;
  }

  get resistor(): number{
    return this._resistor;
  }

  async clean(): Promise<Output> {
    const command = 'python C:\\Scripts\\STK_clean.py';
    const res = await this.equipmentFileService.runScript(command);
    this.setResistorMin();
    return res;
  }


  async runPhysicalImpactScript(
    buttons: string = '00000000',
    resistor: string = '00000',
  ): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const command =
      'python C:\\Scripts\\STK_but_adc.py' +
      ' ' +
      buttons +
      ' ' +
      resistor;
      const res = await this.equipmentFileService.runScript(command);
      this._resistor = parseInt(resistor.slice(1));
      return res;;
  }

  valueResistorToCommand(value: number): string {
    let command: string = '10000';
    const strValue = value.toString();
    const lenght = strValue.length;
    command = command.slice(0, 5 - lenght) + strValue;
    return command;
  }

  async flashFile(file: Express.Multer.File): Promise<Output> {
    await this.clean();
    const filename: string = await this.equipmentFileService.saveFile(file);
    console.log(filename);
    const command = 'python C:\\Scripts\\STK_prog.py' + ' ' + filename;
    const res = await this.equipmentFileService.runScript(command);
    this.setResistorMin();
    return res;
  }

  async reflashFile(): Promise<Output> {
    const filename = await this.equipmentFileService.findSourceFileInWindows('hex');
    console.log('flash file: ', filename);
    const command = 'python C:\\Scripts\\STK_prog.py' + ' ' + filename;
    const res = await this.equipmentFileService.runScript(command);
    this.setResistorMin();
    return res;
  }
}
