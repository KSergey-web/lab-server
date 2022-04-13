import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OutputDTO } from 'src/share/dto/output.dto';
import { Output } from 'src/share/response/output.interface';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';
import { ButtonsDTO } from './dto/buttons.dto';
import { SwitchesAndButtnsDTO } from './dto/switches-And-Buttons.dto';
import { SwitchesDTO } from './dto/switches.dto';

@ApiTags('Altera-de1-so-c')
@Controller('altera-de1-so-c')
export class AlteraDe1SoCController {
  constructor(private readonly alteraDe1SoCService: AlteraDe1SoCService) {}

  @Get('clean')
  @ApiOkResponse({
    type: OutputDTO,
  })
  clear(): Promise<Output> {
    return this.alteraDe1SoCService.clean();
  }

  @Post('upload')
  @ApiOkResponse({
    type: OutputDTO,
  })
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
  @ApiOkResponse({
    type: OutputDTO,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Output> {
    if (!file) throw new BadRequestException('file is not getted');
    return this.alteraDe1SoCService.flashFile(file);
  }

  @Get('switches/:switches/buttons/:buttons')
  @ApiOkResponse({
    type: OutputDTO,
  })
  runPhysicalImpactScript(
    @Param() params: SwitchesAndButtnsDTO,
  ): Promise<Output> {
    return this.alteraDe1SoCService.runPhysicalImpactScript(
      params.switches,
      params.buttons,
    );
  }

  @Get('buttons/:buttons')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(@Param() params: ButtonsDTO): Promise<Output> {
    return this.alteraDe1SoCService.runPhysicalImpactScript(
      undefined,
      params.buttons,
    );
  }

  @Get('switches/:switches')
  resistorAction(@Param() params: SwitchesDTO): Promise<Output> {
    return this.alteraDe1SoCService.runPhysicalImpactScript(params.switches);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(): Promise<Output> {
    return this.alteraDe1SoCService.reflashFile();
  }
}
