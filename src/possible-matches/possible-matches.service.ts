import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Jobcard } from 'src/company/Jobcard.entity';
import { UserLogin } from 'src/users/users.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class PossibleMatchesService {
  constructor(
    @InjectConnection() private dbCon: Connection,
    @InjectRepository(Jobcard) private JobcardRepository: Repository<Jobcard>,
    @InjectRepository(UserLogin) private UserLoginRepo: Repository<UserLogin>,
  ) {}
  async evalRecommendation(_userid: number, _cardid: number) {
    //_userid = userid who send this request
    //_cardid = id of the card that clicked (jobcard, user)

    //type from UserLoginRepository
    //0 = user
    //1 = company
    const usertype = await this.UserLoginRepo.findOne({
      select: ['type'],
      where: { userid: _userid },
    });

    if (usertype.type == 0) {
      //function for user
      return await this.executeUserAction(_userid, _cardid);
    } else if (usertype.type == 1) {
      //function for company
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
    const possible_matches = await this.dbCon.query(
      `SELECT * FROM possible_matches WHERE userid_of_liked_user = ?`,
      [_userid],
    );
    if (possible_matches.length > 0) {
      //delete entry
      const delete_sql = `DELETE FROM possible_matches WHERE userid_of_liked_user = ? AND userid = ?`;
      await this.dbCon.query(delete_sql, [_userid, _cardid]);
      //create new entry for chatroom && messages
      return { message: `It's a match!` };
    }
    //get userid of jobcard that was clicked
    const jobcard = await this.JobcardRepository.findOne({
      select: ['userid_fk'],
      where: { jobcardid: _cardid.toString() },
    });
    //add entry
    const insert_sql = `INSERT INTO possible_matches (userid_of_liked_user, userid) VALUES (?, ?)`;
    await this.dbCon.query(insert_sql, [_userid, jobcard]);
    return { message: `Possible match added` };
  }

  /**
   * 1. Check which type user has (company aka jobcard or normal user)
   * 2. When _userid = normal user: get jobcarddata with _jobcardid => check if _userid = userid_of_liked_user and companyid = userid ? create new chatroom etc : make new entry in possible_matches table
   * 3. When _userid = company: check if companyid = userid_of_liked_user and userid of normal user = userid ? create new chatroom etc : make new entry in possible_matches table
   *
   *
   *
   **/

  private async executeCompanyAction(_userid: number, _cardid: number) {
    //_userid = companyid who send this request
    //_cardid = id of user that clicked user
    //check if userid = userid_of_liked_user in possible_matches
    //if yes, delete this entry
    //if no, add this entry
    //return all possible matches
    const possible_matches = await this.dbCon.query(
      `SELECT * FROM possible_matches WHERE userid_of_liked_user = ? and userid = ?`,
      [_userid, _cardid],
    );
    if (possible_matches.length > 0) {
      //delete entry
      const delete_sql = `DELETE FROM possible_matches WHERE userid_of_liked_user = ? AND userid = ?`;
      await this.dbCon.query(delete_sql, [_userid, _cardid]);
      //create new entry for chatroom && messages
      return { message: `It's a match!` };
    }
    //get userid of jobcard that was clicked
    const jobcard = await this.JobcardRepository.findOne({
      select: ['userid_fk'],
      where: { jobcardid: _cardid.toString() },
    });
    //add entry
    const insert_sql = `INSERT INTO possible_matches (userid_of_liked_user, userid) VALUES (?, ?)`;
    await this.dbCon.query(insert_sql, [_userid, jobcard]);
    return { message: `Possible match added` };
  }
}
