import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Stk500Module } from './stk500/stk500.module';
import { AlteraDe1SoCModule } from './altera-de1-so-c/altera-de1-so-c.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [Stk500Module, AlteraDe1SoCModule],
})
export class AppModule {}
