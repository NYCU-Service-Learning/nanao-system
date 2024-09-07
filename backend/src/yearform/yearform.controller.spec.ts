import { Test, TestingModule } from '@nestjs/testing';
import { YearformController } from './yearform.controller';
import { YearformService } from './yearform.service';

describe('YearformController', () => {
  let controller: YearformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YearformController],
      providers: [YearformService],
    }).compile();

    controller = module.get<YearformController>(YearformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
