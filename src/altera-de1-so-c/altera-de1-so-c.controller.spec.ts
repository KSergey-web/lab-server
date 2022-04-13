import { Test, TestingModule } from '@nestjs/testing';
import { AlteraDe1SoCController } from './altera-de1-so-c.controller';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';

describe('AlteraDe1SoCController', () => {
  let controller: AlteraDe1SoCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlteraDe1SoCController],
      providers: [AlteraDe1SoCService],
    }).compile();

    controller = module.get<AlteraDe1SoCController>(AlteraDe1SoCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
