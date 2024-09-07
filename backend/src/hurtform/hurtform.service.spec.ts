import { Test, TestingModule } from '@nestjs/testing';
import { HurtformService } from './hurtform.service';

describe('HurtformService', () => {
  let service: HurtformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HurtformService],
    }).compile();

    service = module.get<HurtformService>(HurtformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
