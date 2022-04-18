import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentFilesService } from './equipment-files.service';

describe('OperationsInTerminalService', () => {
  let service: EquipmentFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentFilesService],
    }).compile();

    service = module.get<EquipmentFilesService>(EquipmentFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
