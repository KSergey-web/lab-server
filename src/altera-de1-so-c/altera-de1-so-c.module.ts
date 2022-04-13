import { Module } from '@nestjs/common';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';
import { AlteraDe1SoCController } from './altera-de1-so-c.controller';

@Module({
  controllers: [AlteraDe1SoCController],
  providers: [AlteraDe1SoCService],
})
export class AlteraDe1SoCModule {}
