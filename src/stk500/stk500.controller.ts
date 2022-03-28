import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Stk500Service } from './stk500.service';
import { ButtonDTO } from './dto/button.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('stk500')
export class Stk500Controller {
  constructor(private readonly stk500Service: Stk500Service) {}


  @Get('clear')
  clear() {
    return this.stk500Service.clear();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.stk500Service.flashFile(file);
  }

  @Get('button/:buttons/resistor/:resistor')
  button(
    @Param() params: ButtonDTO,
  ) {
    return this.stk500Service.button(params.buttons, params.resistor);
  }
}
