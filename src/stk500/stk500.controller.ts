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
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ButtonsAndResistorDTO } from './dto/buttons-and-resistor';
import { ButtonsDTO } from './dto/buttons';
import { ResistorDTO } from './dto/resistor';
import { Output } from 'src/share/response/output.interface';
import { OutputDTO } from 'src/share/dto/output.dto';

@ApiTags('stk500')
@Controller('stk500')
export class Stk500Controller {
  constructor(private readonly stk500Service: Stk500Service) {}

  @Get('resistor')
  @ApiOkResponse({
    type: ResistorDTO,
  })
  getResisor(): { resistor: number } {
    return { resistor: this.stk500Service.resistor };
  }

  @Get('clean')
  @ApiOkResponse({
    type: OutputDTO,
  })
  clear(): Promise<Output> {
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
  @ApiOkResponse({
    type: OutputDTO,
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Output> {
    if (!file) throw new BadRequestException('file is not getted');
    return this.stk500Service.flashFile(file);
  }

  @Get('button/:buttons/resistor/:resistor')
  @ApiOkResponse({
    type: OutputDTO,
  })
  runPhysicalImpactScript(
    @Param() params: ButtonsAndResistorDTO,
  ): Promise<Output> {
    return this.stk500Service.runPhysicalImpactScript(
      params.buttons,
      params.resistor,
    );
  }

  @Get('button/:buttons')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(@Param() params: ButtonsDTO): Promise<Output> {
    return this.stk500Service.runPhysicalImpactScript(params.buttons);
  }

  @Get('resistor/:resistor')
  @ApiOkResponse({
    type: OutputDTO,
  })
  resistorAction(@Param() params: ResistorDTO): Promise<Output> {
    const command: string = this.stk500Service.valueResistorToCommand(
      params.resistor,
    );
    return this.stk500Service.runPhysicalImpactScript(undefined, command);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(): Promise<Output> {
    return this.stk500Service.reflashFile();
  }
}
