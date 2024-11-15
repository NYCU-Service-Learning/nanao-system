import { Test, TestingModule } from '@nestjs/testing';
import { MentalformService } from './mentalform.service';

describe('MentalformService', () => {
  let service: MentalformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentalformService],
    }).compile();

    service = module.get<MentalformService>(MentalformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
