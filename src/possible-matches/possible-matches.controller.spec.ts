import { Test, TestingModule } from '@nestjs/testing';
import { PossibleMatchesController } from './possible-matches.controller';

describe('PossibleMatchesController', () => {
  let controller: PossibleMatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PossibleMatchesController],
    }).compile();

    controller = module.get<PossibleMatchesController>(
      PossibleMatchesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
