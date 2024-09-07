import { Test, TestingModule } from '@nestjs/testing';
import { YearformService } from './yearform.service';

describe('YearformService', () => {
  let service: YearformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YearformService],
    }).compile();

    service = module.get<YearformService>(YearformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
