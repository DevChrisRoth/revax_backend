import { Module } from '@nestjs/common';
import { PossibleMatchesService } from './possible-matches.service';

@Module({
  providers: [PossibleMatchesService],
  exports: [PossibleMatchesService],
})
export class PossibleMatchesModule {}
