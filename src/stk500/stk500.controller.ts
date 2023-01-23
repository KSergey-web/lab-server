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
import { DeviceInfoDTO } from 'src/share/dto/device-info.dto';
import { DevicePortDTO } from 'src/share/dto/device-port.dto';

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
  getResistor(@Query() query: DevicePortDTO): { resistor: number } {
    return {
      resistor: this.stk500Service.getResistorValueByPort(query.devicePort),
    };
  }

  @Get('button/:buttonInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(
    @Param() dto: ButtonDTO,
    @Query() deviceInfo: DeviceInfoDTO,
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
  clear(@Query() query: DeviceInfoDTO): Promise<Output> {
    return this.stk500Service.clean(query.devicePort);
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
    @Query() query: DeviceInfoDTO,
  ): Promise<Output> {
    if (!file) throw new BadRequestException('file is not getted');
    return this.stk500Service.flashFile(file, query.devicePort);
  }

  @Get('resistor/:resistor')
  @ApiOkResponse({
    type: OutputDTO,
  })
  resistorAction(
    @Param() params: ResistorDTO,
    @Query() deviceInfo: DeviceInfoDTO,
  ): Promise<Output> {
    return this.stk500Service.changeResistorStatus(params.resistor, deviceInfo);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(@Query() query: DeviceInfoDTO): Promise<Output> {
    return this.stk500Service.reflashFile(query.devicePort);
  }
}
