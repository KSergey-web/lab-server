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
import { AlteraDe1SoCInterceptor } from './altera-de1-so-c.interceptor';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';
import { ButtonDTO } from './dto/button.dto';
import { ButtonsDTO } from './dto/buttons.dto';
import { SwitchDTO } from './dto/switch.dto';
import { SwitchesAndButtnsDTO } from './dto/switches-And-Buttons.dto';
import { SwitchesDTO } from './dto/switches.dto';

@ApiTags('Altera-de1-so-c')
@Controller('altera-de1-so-c')
@UseInterceptors(AlteraDe1SoCInterceptor)
export class AlteraDe1SoCController {
  constructor(private readonly alteraDe1SoCService: AlteraDe1SoCService) {}

  @Get('clean')
  @ApiOkResponse({
    type: OutputDTO,
  })
  clear(): Promise<Output> {
    return this.alteraDe1SoCService.clean();
  }

  @Get('status-switches')
  @ApiOkResponse({
    type: SwitchesDTO,
  })
  getStatusSwitches(): { switches: string } {
    return { switches: this.alteraDe1SoCService.switches };
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

  @Get('button/:buttonInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(@Param() dto: ButtonDTO): Promise<Output> {
    return this.alteraDe1SoCService.changeButtonStatusByInd(dto.buttonInd);
  }

  @Get('switch/:switchInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  switchAction(@Param() dto: SwitchDTO): Promise<Output> {
    return this.alteraDe1SoCService.changeSwitchStatusByInd(dto.switchInd);
  }

  @Get('buttons/:buttons')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonsAction(@Param() params: ButtonsDTO): Promise<Output> {
    return this.alteraDe1SoCService.runPhysicalImpactScript(
      undefined,
      params.buttons,
    );
  }

  @Get('switches/:switches')
  switchesAction(@Param() params: SwitchesDTO): Promise<Output> {
    return this.alteraDe1SoCService.runPhysicalImpactScript(params.switches);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(): Promise<Output> {
    return this.alteraDe1SoCService.reflashFile();
  }

  @Get('turn-off-switches')
  @ApiOkResponse({
    type: OutputDTO,
  })
  turnOffSwitches(): Promise<Output> {
    return this.alteraDe1SoCService.turnOffSwitches();
  }
}
