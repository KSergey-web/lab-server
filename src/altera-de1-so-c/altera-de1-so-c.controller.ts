import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IEquipmentDTO } from 'src/share/dto/equipment.dto';
import { OutputDTO } from 'src/share/dto/output.dto';
import { Output } from 'src/share/response/output.interface';
import { AlteraDe1SoCInterceptor } from './altera-de1-so-c.interceptor';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';
import { ButtonDTO } from './dto/button.dto';
import { SwitchDTO } from './dto/switch.dto';
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
  clear(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.alteraDe1SoCService.clean(query);
  }

  @Get('status-switches')
  @ApiOkResponse({
    type: SwitchesDTO,
  })
  getStatusSwitches(@Query() query: IEquipmentDTO): { switches: string } {
    return { switches: this.alteraDe1SoCService.getSwitches(query.id) };
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
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: IEquipmentDTO,
  ): Promise<Output> {
    if (!file) throw new BadRequestException('file is not getted');
    return this.alteraDe1SoCService.flashFile(file, query);
  }

  @Get('button/:buttonInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(
    @Param() dto: ButtonDTO,
    @Query() query: IEquipmentDTO,
  ): Promise<Output> {
    return this.alteraDe1SoCService.changeButtonStatusByInd(
      dto.buttonInd,
      query,
    );
  }

  @Get('switch/:switchInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  switchAction(
    @Param() dto: SwitchDTO,
    @Query() query: IEquipmentDTO,
  ): Promise<Output> {
    return this.alteraDe1SoCService.changeSwitchStatusByInd(
      dto.switchInd,
      query,
    );
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.alteraDe1SoCService.reflashFile(query);
  }

  @Get('turn-off-switches')
  @ApiOkResponse({
    type: OutputDTO,
  })
  turnOffSwitches(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.alteraDe1SoCService.turnOffSwitches(query);
  }
}
