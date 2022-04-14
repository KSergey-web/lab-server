import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as util from 'util';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Output } from 'src/share/response/output.interface';

@Injectable()
export class Stk500Service {
  private _resistor: number = 32;

  private setResistorMin(): void{
    this._resistor = 32;
  }

  get resistor(): number{
    return this._resistor;
  }

  async clean(): Promise<Output> {
    const command = 'python C:\\inetpub\\wwwroot\\STK_clean.py';
    const res = await this.runScript(command);
    this.setResistorMin();
    return res;
  }

  async runScript(command: string): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const { stdout, stderr } = await exec(command);
    console.log('com ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (stderr) new HttpException(`Some error during execution or start up a script \n stderr: ${stderr}`, HttpStatus.SERVICE_UNAVAILABLE);
    return await this.getLogs();
  }

  async runPhysicalImpactScript(
    buttons: string = '00000000',
    resistor: string = '00000',
  ): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const command =
      'python C:\\inetpub\\wwwroot\\STK_but_adc.py' +
      ' ' +
      buttons +
      ' ' +
      resistor;
      const res = await this.runScript(command);
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
    const filename: string = await this.saveFile(file);
    console.log(filename);
    const command = 'python C:\\inetpub\\wwwroot\\STK_prog.py' + ' ' + filename;
    const res = await this.runScript(command);
    this.setResistorMin();
    return res;
  }

  async reflashFile(): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const { stdout: files } = await exec('dir *.hex /B/o:-d');
    const arrayfiles = files.split('\n');
    if (arrayfiles.length < 1)
      throw new BadRequestException('Hex file in directory is not found');
    const filename = arrayfiles[0];
    console.log('flash file: ', filename);
    const command = 'python C:\\inetpub\\wwwroot\\STK_prog.py' + ' ' + filename;
    const res = await this.runScript(command);
    this.setResistorMin();
    return res;
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const write = await fs.promises.writeFile(
      //    `C:\\inetpub\\wwwroot\\${file.originalname}`,
      `./${file.originalname}`,
      file.buffer,
    );
    return file.originalname;
  }

  async getLogs(): Promise<{ stdout: string }> {
    const readFile = util.promisify(fs.readFile);
    const logs: string = await readFile(
      'C:\\inetpub\\wwwroot\\Log.txt',
      'utf8',
    );
    return { stdout: logs };
  }
}
