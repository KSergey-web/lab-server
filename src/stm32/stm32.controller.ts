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
import { Stm32Interceptor } from './stm32.interceptor';
import { Stm32Service } from './stm32.service';

@Controller('stm32')
@ApiTags('stm32')
@UseInterceptors(Stm32Interceptor)
export class Stm32Controller {
  constructor(private readonly stm32Service: Stm32Service) {}

  @Get('button/:buttonInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  async buttonAction(
    @Param() dto: ButtonDTO,
    @Query() deviceInfo: IEquipmentDTO,
  ): Promise<Output> {
    await this.stm32Service.changeButtonStatusByInd(dto.buttonInd, deviceInfo);
    return {
      stdout:
        new Date().toLocaleTimeString() +
        ' ' +
        `Состояние кнопки SW${dto.buttonInd} изменено`,
    };
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
    return this.stm32Service.flashFile(file, query);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.stm32Service.reflashFile(query);
  }

  @Get('clean')
  @ApiOkResponse({
    type: OutputDTO,
  })
  clea(@Query() query: IEquipmentDTO): Promise<Output> {
    return this.stm32Service.clean(query);
  }
}
