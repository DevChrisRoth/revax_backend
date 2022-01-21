import { Test, TestingModule } from '@nestjs/testing';
import { PossibleMatchesService } from './possible-matches.service';

describe('PossibleMatchesService', () => {
  let service: PossibleMatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PossibleMatchesService],
    }).compile();

    service = module.get<PossibleMatchesService>(PossibleMatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
