import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgramContentController } from './training-program-content.controller';

describe('TrainingProgramContentController', () => {
  let controller: TrainingProgramContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingProgramContentController],
    }).compile();

    controller = module.get<TrainingProgramContentController>(TrainingProgramContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
