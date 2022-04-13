import { Test, TestingModule } from '@nestjs/testing';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';

describe('AlteraDe1SoCService', () => {
  let service: AlteraDe1SoCService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlteraDe1SoCService],
    }).compile();

    service = module.get<AlteraDe1SoCService>(AlteraDe1SoCService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
