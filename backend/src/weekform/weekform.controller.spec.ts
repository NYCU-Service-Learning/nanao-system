import { Test, TestingModule } from '@nestjs/testing';
import { WeekformController } from './weekform.controller';
import { WeekformService } from './weekform.service';

describe('WeekformController', () => {
  let controller: WeekformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeekformController],
      providers: [WeekformService],
    }).compile();

    controller = module.get<WeekformController>(WeekformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
