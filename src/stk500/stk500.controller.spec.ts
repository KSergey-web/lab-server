import { Test, TestingModule } from '@nestjs/testing';
import { Stk500Controller } from './stk500.controller';
import { Stk500Service } from './stk500.service';

describe('Stk500Controller', () => {
  let controller: Stk500Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Stk500Controller],
      providers: [Stk500Service],
    }).compile();

    controller = module.get<Stk500Controller>(Stk500Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
