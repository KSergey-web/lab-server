import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as util from 'util';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Output } from '../response/output.interface';

@Injectable()
export class EquipmentFilesService {

    async findSourceFileInWindows(fileExtension: string, directoryPath: string = 'C:\\Scripts\\') {
        const exec = util.promisify(ChildProcess.exec);
        const { stdout: files } = await exec(`dir ${directoryPath}*.${fileExtension} /B/o:-d`);
        const arrayfiles = files.split('\n');
        if (arrayfiles.length < 1)
            throw new BadRequestException(`File with extension '${fileExtension}' in directory '${directoryPath}' is not found!`);
        const filename = arrayfiles[0];
        return filename;
    }

    async runScript(command: string): Promise<Output> {
        const exec = util.promisify(ChildProcess.exec);
        const { stdout, stderr } = await exec(command);
        console.log('--------------');
        console.log('command: ', command);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        console.log('stderr:', stderr);
        console.log('--------------');
        if (stderr) new HttpException(`Some error during execution or start up a script \n stderr: ${stderr}`, HttpStatus.SERVICE_UNAVAILABLE);
        return await this.getLogs();
    }

    async getLogs(directoryPath: string = 'C:\\Scripts\\', fileName: string = 'Log.txt'): Promise<Output> {
        const readFile = util.promisify(fs.readFile);
        const logs: string = await readFile(directoryPath + fileName, 'utf8');
        return { stdout: logs };
    }

    async saveFile(file: Express.Multer.File, directoryPath: string = 'C:\\Scripts\\'): Promise<string> {
        try {
            await fs.promises.writeFile(
                //    `C:\\inetpub\\wwwroot\\${file.originalname}`,
                directoryPath + file.originalname,
                file.buffer,
            );
            return file.originalname;
        } catch (err) {
            throw new HttpException(`File ${file.originalname} was not saved.\n stderr:${(err as Error).message}`, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
