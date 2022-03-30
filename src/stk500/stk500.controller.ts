import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { Stk500Service } from './stk500.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ButtonsAndResistorDTO } from './dto/buttons-and-resistor';
import { ButtonsDTO } from './dto/buttons';
import { ResistorDTO } from './dto/resistor';

@Controller('stk500')
export class Stk500Controller {
  constructor(private readonly stk500Service: Stk500Service) {}

  @Get('clean')
  clear() {
    return this.stk500Service.clean();
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is not getted');
    return this.stk500Service.flashFile(file);
  }

  @Get('button/:buttons/resistor/:resistor')
  runPhysicalImpactScript(@Param() params: ButtonsAndResistorDTO) {
    return this.stk500Service.runPhysicalImpactScript(
      params.buttons,
      params.resistor,
    );
  }

  @Get('button/:buttons')
  buttonAction(@Param() params: ButtonsDTO) {
    return this.stk500Service.runPhysicalImpactScript(params.buttons);
  }

  @Get('resistor/:resistor')
  resistorAction(@Param() params: ResistorDTO) {
    const command: string = this.stk500Service.valueResistorToCommand(
      params.resistor,
    );
    return this.stk500Service.runPhysicalImpactScript(undefined, command);
  }

  @Get('reset')
  reset() {
    return this.stk500Service.reflashFile();
  }
}
