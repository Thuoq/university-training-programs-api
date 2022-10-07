import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgramContentService } from './training-program-content.service';

describe('TrainingProgramContentService', () => {
  let service: TrainingProgramContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingProgramContentService],
    }).compile();

    service = module.get<TrainingProgramContentService>(TrainingProgramContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
