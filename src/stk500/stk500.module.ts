import { Module } from '@nestjs/common';
import { Stk500Service } from './stk500.service';
import { Stk500Controller } from './stk500.controller';

@Module({
  controllers: [Stk500Controller],
  providers: [Stk500Service],
})
export class Stk500Module {}
