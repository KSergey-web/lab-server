import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Stk500Service } from './stk500.service';
import { ButtonDTO } from './dto/button.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('stk500')
export class Stk500Controller {
  constructor(private readonly stk500Service: Stk500Service) {}


  @Get('clear')
  clear() {
    return this.stk500Service.clear();
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
    if (!file) throw new BadRequestException("file is not getted");
    return this.stk500Service.flashFile(file);
  }

  @Get('button/:buttons/resistor/:resistor')
  button(
    @Param() params: ButtonDTO,
  ) {
    return this.stk500Service.button(params.buttons, params.resistor);
  }
}
