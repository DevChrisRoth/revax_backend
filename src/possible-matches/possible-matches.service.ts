import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobcard } from 'src/company/Jobcard.entity';
import { UserLogin } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { PossibleMatches } from './possible-matches.entity';

@Injectable()
export class PossibleMatchesService {
  constructor(
    @InjectRepository(Jobcard) private JobcardRepository: Repository<Jobcard>,
    @InjectRepository(UserLogin) private UserLoginRepo: Repository<UserLogin>,
    @InjectRepository(PossibleMatches)
    private PossibleMatchesRepo: Repository<PossibleMatches>,
  ) {}
  async evalRecommendation(
    _userid: number,
    _cardid: number,
    _usertype: number,
  ) {
    if (_usertype == 0) {
      //function if user click jobcard
      return await this.executeUserAction(_userid, _cardid);
    } else if (_usertype == 1) {
      //function if company clicked a user
      return await this.executeCompanyAction(_userid, _cardid);
    }
    return { error: 'Something went wrong' };
  }

  private async executeUserAction(_userid: number, _cardid: number) {
    //_userid = userid who send this request
    //_cardid = id of the card that clicked (jobcard, user)
    //check if userid = userid_of_liked_user in possible_matches
    //if yes, delete this entry
    //if no, add this entry
    //return all possible matches
    const possible_matches = await this.PossibleMatchesRepo.count({
      where: { userid_of_liked_user: _userid },
    });
    if (possible_matches > 0) {
      //delete entry
      await this.PossibleMatchesRepo.delete({
        userid_of_liked_user: _userid,
        userid_fk: _cardid,
      });
      //>>TODO 🛑 service for chatroom and messages
      return { message: `It's a match!` };
    }
    //get userid of jobcard that was clicked
    const jobcard = await this.JobcardRepository.findOneOrFail({
      select: ['userid_fk'],
      where: { jobcardid: _cardid },
    });
    //add entry
    await this.PossibleMatchesRepo.insert({
      userid_of_liked_user: jobcard.userid_fk,
      userid_fk: _userid,
    });
    return { message: `Possible match added` };
  }
  private async executeCompanyAction(_userid: number, _cardid: number) {
    //_userid = companyid who send this request
    //_cardid = id of user that clicked user
    //check if userid = userid_of_liked_user in possible_matches
    //if yes, delete this entry
    //if no, add this entry
    //return all possible matches
    const possible_matches = await this.PossibleMatchesRepo.count({
      where: { userid_of_liked_user: _userid, userid_fk: _cardid },
    });
    if (possible_matches > 0) {
      //delete entry
      await this.PossibleMatchesRepo.delete({
        userid_of_liked_user: _userid,
        userid_fk: _cardid,
      });
      //>>TODO 🛑 service for chatroom and messages
      return { message: `It's a match!` };
    }
    //get userid of jobcard that was clicked
    const user = await this.UserLoginRepo.findOneOrFail({
      select: ['userid'],
      where: { userid: _cardid },
    });
    //add entry
    await this.PossibleMatchesRepo.insert({
      userid_of_liked_user: user.userid,
      userid_fk: _userid,
    });
    return { message: `Possible match added` };
  }
}
