import { Test, TestingModule } from '@nestjs/testing';
import { Stm32Controller } from './stm32.controller';
import { Stm32Service } from './stm32.service';

describe('Stm32Controller', () => {
  let controller: Stm32Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Stm32Controller],
      providers: [Stm32Service],
    }).compile();

    controller = module.get<Stm32Controller>(Stm32Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
