import { Test, TestingModule } from '@nestjs/testing';
import { HurtformController } from './hurtform.controller';
import { HurtformService } from './hurtform.service';

describe('HurtformController', () => {
  let controller: HurtformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HurtformController],
      providers: [HurtformService],
    }).compile();

    controller = module.get<HurtformController>(HurtformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
