import { Test, TestingModule } from '@nestjs/testing';
import { Stk500Service } from './stk500.service';

describe('Stk500Service', () => {
  let service: Stk500Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Stk500Service],
    }).compile();

    service = module.get<Stk500Service>(Stk500Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
