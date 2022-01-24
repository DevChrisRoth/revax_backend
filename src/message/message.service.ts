import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/users/UserData.entity';
import { Connection, Repository } from 'typeorm';
import { Chatroom } from './chatroom.entity';
import { Messages } from './messages.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Chatroom) private ChatroomRepo: Repository<Chatroom>,
    @InjectRepository(Messages) private MessagesRepo: Repository<Messages>,
    @InjectConnection() private dbCon: Connection,
    @InjectRepository(UserData) private UserDataRepo: Repository<UserData>,
  ) {}

  async getAllChatroomsOfUser(_userid: number, _type: number): Promise<any> {
    // check if user got already messages
    // 🛑🛑if true, get messages ordered by message_created_at desc, return chatrooms and messages
    // if false, get chatrooms only
    const countMessages = await this.MessagesRepo.count({
      where: {
        userid_fk: _userid,
      },
    });
    if (countMessages > 0) {
      return await this.getChatroomsOnly(_userid, _type);
    } else {
      //get all chatrooms ordered by last message sent
      return await this.getChatroomsOnly(_userid, _type);
    }
  }

  private async getChatroomsOnly(_userid: number, _type: number) {
    //get chatrooms where connection_userid_fk = _userid or connection_connection_userid_fk = _userid
    let chatroomList: Chatroom[] = [];
    let chatrooms: Chatroom[] = [];
    let userDataOfChatrooms: any;
    if (_type === 1) {
      chatrooms = await this.ChatroomRepo.find({
        select: ['chatroom_id', 'normal_userid_fk', 'company_userid_fk'],
        where: {
          company_userid_fk: _userid,
        },
      });
      //get userdata of connection_userid_fk2
      //loop through chatrooms1 and get userdata of connection_connection_userid_fk2
      userDataOfChatrooms = await Promise.all(
        chatrooms.map(async (chatroom) => {
          const userdata = await this.UserDataRepo.findOneOrFail({
            select: ['firstname', 'lastname'],
            where: {
              userid_fk: chatroom.normal_userid_fk,
            },
          });
          return {
            ...chatroom,
            userdata,
          };
        }),
      );
      chatroomList.push(...userDataOfChatrooms);
      //if user = normal user
    } else if (_type === 0) {
      chatrooms = await this.ChatroomRepo.find({
        select: ['chatroom_id', 'normal_userid_fk', 'company_userid_fk'],
        where: {
          normal_userid_fk: _userid,
        },
      });
      userDataOfChatrooms = await Promise.all(
        chatrooms.map(async (chatroom) => {
          const userdata = await this.UserDataRepo.findOneOrFail({
            select: ['companyname', 'phonenumber'],
            where: {
              userid_fk: chatroom.company_userid_fk,
            },
          });
          return {
            ...chatroom,
            userdata,
          };
        }),
      );
      chatroomList.push(...userDataOfChatrooms);
    }
    return chatroomList;
  }

  /*
   * 1. Check if user already send messages
   * 2. If not, get only chatrooms where user is sender or receiver
   * 3. If yes, get all chatrooms and messages where user is sender or receiver
   *
   */

  async getMessages(_chartroomid_fk: number) {
    //get messages from messages where chatroomid_fk = _chartroomid_fk order by message_created_at desc
    return this.MessagesRepo.find({
      select: ['message_id', 'message', 'message_created_at', 'userid_fk'],
      where: {
        chatroom_id_fk: _chartroomid_fk,
      },
      order: {
        message_created_at: 'DESC',
      },
      take: 25,
    });
  }

  async sendMessage(
    _userid: number,
    _chartroomid_fk: number,
    _message: string,
  ) {
    //insert into messages (userid_fk, chatroomid_fk, message, message_created_at) values (_userid, _chartroomid_fk, _message, now())
    await this.MessagesRepo.insert({
      userid_fk: _userid,
      chatroomid_fk: _chartroomid_fk,
      message: _message,
    });
    return { status: 'success' };
  }

  async removeChatroom(_chatroomid: number) {
    //delete from chatrooms where chatroom_id = _chartroomid_fk
    await this.ChatroomRepo.delete({
      chatroom_id: _chatroomid,
    });
    //delete all messages where chatroom_id = _chartroomid_fk
    await this.MessagesRepo.delete({
      chatroomid_fk: _chatroomid,
    });
    return { status: 'success' };
  }
}
