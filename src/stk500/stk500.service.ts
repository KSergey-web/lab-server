import { BadRequestException, Injectable } from '@nestjs/common';
import * as util from 'util';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class Stk500Service {
  async clean() {
    const exec = util.promisify(ChildProcess.exec);
    const command = 'python C:\\inetpub\\wwwroot\\STK_clean.py';
    const { stdout, stderr } = await exec(command);
    console.log('com ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (stderr) return 'stderr:' + stderr;
    return await this.getLogs();
  }

  async runPhysicalImpactScript(
    buttons: string = '00000000',
    resistor: string = '00000',
  ) {
    const exec = util.promisify(ChildProcess.exec);
    const command =
      'python C:\\inetpub\\wwwroot\\STK_but_adc.py' +
      ' ' +
      buttons +
      ' ' +
      resistor;
    const { stdout, stderr } = await exec(command);
    console.log('com ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (stderr) return 'stderr:' + stderr;
    return await this.getLogs();
  }

  valueResistorToCommand(value: number): string {
    let command: string = '10000';
    const strValue = value.toString();
    const lenght = strValue.length;
    command = command.slice(0, 5 - lenght) + strValue;
    return command;
  }

  async flashFile(file: Express.Multer.File) {
    await this.clean();
    const exec = util.promisify(ChildProcess.exec);
    const filename: string = await this.saveFile(file);
    console.log(filename);
    const command = 'python C:\\inetpub\\wwwroot\\STK_prog.py' + ' ' + filename;
    const { stdout, stderr } = await exec(command);
    console.log('com ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (stderr) return 'stderr:' + stderr;
    return await this.getLogs();
  }

  async reflashFile() {
    const exec = util.promisify(ChildProcess.exec);
    const { stdout: files } = await exec('dir *.hex /B/o:-d');
    const arrayfiles = files.split('\n');
    if (arrayfiles.length < 1)
      throw new BadRequestException('Hex file in directory is not found');
    const filename = arrayfiles[0];
    console.log('flash file: ', filename);
    const command = 'python C:\\inetpub\\wwwroot\\STK_prog.py' + ' ' + filename;
    const { stdout, stderr } = await exec(command);
    console.log('com ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (stderr) return 'stderr:' + stderr;
    return await this.getLogs();
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const write = await fs.promises.writeFile(
      //    `C:\\inetpub\\wwwroot\\${file.originalname}`,
      `./${file.originalname}`,
      file.buffer,
    );
    return file.originalname;
  }

  async getLogs() {
    const readFile = util.promisify(fs.readFile);
    const logs: string = await readFile(
      'C:\\inetpub\\wwwroot\\Log.txt',
      'utf8',
    );
    return { stdout: logs };
  }
}
