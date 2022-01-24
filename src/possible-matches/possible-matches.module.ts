import { Global, Module } from '@nestjs/common';
import { PossibleMatchesService } from './possible-matches.service';

@Global()
@Module({
  providers: [PossibleMatchesService],
  exports: [PossibleMatchesService],
})
export class PossibleMatchesModule {}
