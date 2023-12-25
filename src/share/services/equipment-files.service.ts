import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as util from 'util';
import { Output } from '../response/output.interface';

@Injectable()
export class EquipmentFilesService {
  async findSourceFileInWindows(
    fileExtension: string,
    directoryPath = 'C:\\Scripts\\',
  ) {
    const exec = util.promisify(ChildProcess.exec);
    const { stdout: files } = await exec(
      `dir ${directoryPath}*.${fileExtension} /B/o:-d`,
    );
    const arrayfiles = files.split('\n');
    if (arrayfiles.length < 1)
      throw new BadRequestException(
        `File with extension '${fileExtension}' in directory '${directoryPath}' is not found!`,
      );
    const filename = arrayfiles[0];
    return directoryPath + filename;
  }

  async runScript(command: string, getLogsFromFile = true): Promise<Output> {
    const exec = util.promisify(ChildProcess.exec);
    const timeoutPromise = new Promise(
      (resolve: (res: { stdout: string; stderr: string }) => void, reject) => {
        setTimeout(() => {
          resolve({
            stderr:
              'Error TimeOut. Нужно переподключить платы. Команды не могут быть выполнены',
            stdout: '',
          });
        }, 30000);
      },
    );
    const { stdout, stderr } = await Promise.race([
      exec('chcp 65001 | ' + command),
      timeoutPromise,
    ]);
    this.logResultScript(command, stdout, stderr);
    if (stderr)
      throw new HttpException(
        new Date().toLocaleTimeString() +
          ` Ошибка при запуске скрипта: ${command} ; stderr: ${stderr}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    if (getLogsFromFile) {
      return await this.getLogs();
    }
    return {
      stdout: `выполнено: ${command}`,
    };
  }

  private logResultScript(command: string, stdout: string, stderr: string) {
    console.log('--------------');
    console.log('command: ', command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    console.log('--------------');
  }

  async getLogs(
    directoryPath = 'C:\\Scripts\\',
    fileName = 'Log.txt',
  ): Promise<Output> {
    const readFile = util.promisify(fs.readFile);
    const logs: string = await readFile(directoryPath + fileName, 'utf8');
    return { stdout: logs };
  }

  async saveFile(
    file: Express.Multer.File,
    directoryPath = 'C:\\Scripts\\',
  ): Promise<string> {
    try {
      const filePath = directoryPath + file.originalname;
      await fs.promises.writeFile(filePath, file.buffer);
      return filePath;
    } catch (err) {
      throw new HttpException(
        `File ${file.originalname} was not saved.\n stderr:${
          (err as Error).message
        }`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
