import { Test, TestingModule } from '@nestjs/testing';
import { MentalformController } from './mentalform.controller';

describe('MentalformController', () => {
  let controller: MentalformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentalformController],
    }).compile();

    controller = module.get<MentalformController>(MentalformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
