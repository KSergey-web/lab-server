import { BadRequestException, Injectable } from '@nestjs/common';
import * as util from 'util';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Output } from 'src/share/response/output.interface';

@Injectable()
export class AlteraDe1SoCService {
  async clean(): Promise<Output> {
    const command = 'python C:\\Scripts\\FPGA_clean.py';
    return this.runScript(command);
  }

  async turnOffSwitches(): Promise<Output> {
    const command = 'python C:\\Scripts\\FPGA_buttons.py cle 0 0';
    return this.runScript(command);
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
    return this.runScript(command);
  }

  async flashFile(file: Express.Multer.File): Promise<Output> {
    await this.clean();
    const filename: string = await this.saveFile(file);
    console.log(filename);
    const command =
      'python C:\\Scripts\\FPGA_prog.py' + ' ' + `C:\\Scripts\\${filename}`;
    return this.runScript(command);
  }

  async runScript(command: string): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const { stdout, stderr } = await exec(command);
    console.log('com ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (stderr) return { stderr: stderr };
    return await this.getLogs();
  }

  async reflashFile(): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const { stdout: files } = await exec('dir *.hex /B/o:-d');
    const arrayfiles = files.split('\n');
    if (arrayfiles.length < 1)
      throw new BadRequestException('Sof file in directory is not found');
    const filename = arrayfiles[0];
    console.log('flash file: ', filename);
    const command =
      'python C:\\Scripts\\FPGA_prog.py' + ' ' + `C:\\Scripts\\${filename}`;
    return this.runScript(command);
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const write = await fs.promises.writeFile(
      //    `C:\\inetpub\\wwwroot\\${file.originalname}`,
      `C:\\Scripts\\${file.originalname}`,
      file.buffer,
    );
    return file.originalname;
  }

  async getLogs(): Promise<{ stdout: string }> {
    const readFile = util.promisify(fs.readFile);
    const logs: string = await readFile('C:\\Scripts\\Log.txt', 'utf8');
    return { stdout: logs };
  }
}
