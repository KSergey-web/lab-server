import { Module } from '@nestjs/common';
import { Stm32Service } from './stm32.service';
import { Stm32Controller } from './stm32.controller';

@Module({
  controllers: [Stm32Controller],
  providers: [Stm32Service],
})
export class Stm32Module {}
