import { Test, TestingModule } from '@nestjs/testing';
import { Stm32Service } from './stm32.service';

describe('Stm32Service', () => {
  let service: Stm32Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Stm32Service],
    }).compile();

    service = module.get<Stm32Service>(Stm32Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
