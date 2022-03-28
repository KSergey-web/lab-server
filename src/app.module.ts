import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Stk500Module } from './stk500/stk500.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [Stk500Module],
})
export class AppModule {}
