import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as util from 'util';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Output } from 'src/share/response/output.interface';

@Injectable()
export class AlteraDe1SoCService {
    private _switches: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    private setSwitchesToDefault(): void{
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
        const res = await this.runScript(command);
        this.setSwitchesToDefault();
        return res;
    }

    async turnOffSwitches(): Promise<Output> {
        const command = 'python C:\\Scripts\\FPGA_buttons.py cle 0 0';
        const res = await this.runScript(command);
        this.setSwitchesToDefault();
        return res;
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
        const res = await this.runScript(command);
        this.switches = switches;
        return res;
    }

    async flashFile(file: Express.Multer.File): Promise<Output> {
        await this.clean();
        const filename: string = await this.saveFile(file);
        console.log(filename);
        const command =
            'python C:\\Scripts\\FPGA_prog.py' + ' ' + `C:\\Scripts\\${filename}`;
        const res = await this.runScript(command);
        this.setSwitchesToDefault();
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

    async reflashFile(): Promise<Output> {
        const exec = util.promisify(ChildProcess.exec);
        const { stdout: files } = await exec('dir C:\\Scripts\\*.sof /B/o:-d');
        const arrayfiles = files.split('\n');
        if (arrayfiles.length < 1)
            throw new BadRequestException('Sof file in directory is not found');
        const filename = arrayfiles[0];
        console.log('flash file: ', filename);
        const command =
            'python C:\\Scripts\\FPGA_prog.py' + ' ' + `C:\\Scripts\\${filename}`;
        const res = await this.runScript(command);
        this.setSwitchesToDefault();
        return res;
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        const write = await fs.promises.writeFile(
            //    `C:\\inetpub\\wwwroot\\${file.originalname}`,
            `C:\\Scripts\\${file.originalname}`,
            file.buffer,
        );
        return file.originalname;
    }

    async getLogs(): Promise<Output> {
        const readFile = util.promisify(fs.readFile);
        const logs: string = await readFile('C:\\Scripts\\Log.txt', 'utf8');
        return { stdout: logs };
    }
}
