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
import { ButtonDTO } from './dto/button.dto';
import { ResistorDTO } from './dto/resistor';
import { Stk500Interceptor } from './stk500.interceptor';
import { Stk500Service } from './stk500.service';

@ApiTags('stk500')
@Controller('stk500')
@UseInterceptors(Stk500Interceptor)
export class Stk500Controller {
  constructor(private readonly stk500Service: Stk500Service) {}

  @Get('resistor')
  @ApiOkResponse({
    type: ResistorDTO,
  })
  getResistor(@Query() query: IEquipmentDTO): { resistor: number } {
    return {
      resistor: this.stk500Service.getResistorValue(query.id),
    };
  }

  @Get('button/:buttonInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(
    @Param() dto: ButtonDTO,
    @Query() deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    return this.stk500Service.changeButtonStatusByInd(
      dto.buttonInd,
      deviceInfo,
    );
  }

  @Get('clean')
  @ApiOkResponse({
    type: OutputDTO,
  })
  clear(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.stk500Service.clean(query);
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
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: IEquipmentDTO,
  ): Promise<Output> {
    if (!file) throw new BadRequestException('file is not getted');
    return this.stk500Service.flashFile(file, query);
  }

  @Get('resistor/:resistor')
  @ApiOkResponse({
    type: OutputDTO,
  })
  resistorAction(
    @Param() params: ResistorDTO,
    @Query() deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    return this.stk500Service.changeResistorStatus(params.resistor, deviceInfo);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.stk500Service.reflashFile(query);
  }
}
