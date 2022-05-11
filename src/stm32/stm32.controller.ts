import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OutputDTO } from 'src/share/dto/output.dto';
import { Output } from 'src/share/response/output.interface';
import { ButtonDTO } from './dto/button.dto';
import { ButtonsDTO } from './dto/buttons';
import { Stm32Service } from './stm32.service';

@Controller('stm32')
@ApiTags('stm32')
export class Stm32Controller {
  constructor(private readonly stm32Service: Stm32Service) {}

  @Get('buttons/:buttons')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonsAction(@Param() params: ButtonsDTO): Promise<Output> {
    return this.stm32Service.runPhysicalImpactScript(params.buttons);
  }


  @Get('button/:buttonInd')
  @ApiOkResponse({
    type: OutputDTO,
  })
  buttonAction(@Param() dto: ButtonDTO): Promise<Output> {
    return this.stm32Service.changeButtonStatusByInd(
      dto.buttonInd
    );
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
    return this.stm32Service.flashFile(file);
  }

  @Get('reset')
  @ApiOkResponse({
    type: OutputDTO,
  })
  reset(): Promise<Output> {
    return this.stm32Service.reflashFile();
  }


  @Get('clean')
  @ApiOkResponse({
    type: OutputDTO,
  })
  clear(): Promise<Output> {
    return this.stm32Service.clean();
  }
}
