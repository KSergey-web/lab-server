import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Stk500Module } from './stk500/stk500.module';
import { AlteraDe1SoCModule } from './altera-de1-so-c/altera-de1-so-c.module';
import { EquipmentFilesService } from './share/services/equipment-files.service';

@Global()
@Module({
  controllers: [AppController],
  providers: [AppService, EquipmentFilesService],
  imports: [Stk500Module, AlteraDe1SoCModule],
  exports:[EquipmentFilesService]
})
export class AppModule {}
