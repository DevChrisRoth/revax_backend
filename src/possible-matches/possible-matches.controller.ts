import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { PossibleMatchesService } from './possible-matches.service';
@Controller()
export class PossibleMatchesController {
  constructor(
    private readonly possibleMatchesService: PossibleMatchesService,
  ) {}
  //if user accecpted the recommendation
  @UseGuards(AuthenticatedGuard)
  @HttpCode(200)
  @Post('recommendation')
  async postRecommendation(@Request() req: any): Promise<{
    status: string;
  }> {
    try {
      if (Number(req.body['recommendation']) == 0) {
        return null;
      } else {
        return await this.possibleMatchesService.evalRecommendation(
          //logged in user
          req.user.userid,
          // userid of the clicked item
          req.body['cardid'],
          //usertype of the logged in user
          req.user.type,
        );
      }
    } catch (error) {
      return { status: 'failed' };
    }
  }
}
