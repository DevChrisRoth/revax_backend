import { Global, Module } from '@nestjs/common';
import { PossibleMatchesController } from './possible-matches.controller';
import { PossibleMatchesService } from './possible-matches.service';

@Global()
@Module({
  providers: [PossibleMatchesService],
  exports: [PossibleMatchesService],
  controllers: [PossibleMatchesController],
})
export class PossibleMatchesModule {}
