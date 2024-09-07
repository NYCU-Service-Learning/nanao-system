import { Test, TestingModule } from '@nestjs/testing';
import { WeekformService } from './weekform.service';

describe('WeekformService', () => {
  let service: WeekformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeekformService],
    }).compile();

    service = module.get<WeekformService>(WeekformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
