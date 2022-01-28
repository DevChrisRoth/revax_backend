import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/users/UserData.entity';
import { Repository } from 'typeorm';
import { Chatroom } from './chatroom.entity';
import { Messages } from './messages.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Chatroom) private ChatroomRepo: Repository<Chatroom>,
    @InjectRepository(Messages) private MessagesRepo: Repository<Messages>,
    @InjectRepository(UserData) private UserDataRepo: Repository<UserData>,
  ) {}

  async getAllChatroomsOfUser(_userid: number, _type: number): Promise<any> {
    // check if user got already messages
    // 🛑🛑if true, get messages ordered by message_created_at desc, return chatrooms and messages
    // if false, get chatrooms only

    //get all chatrooms ordered by last message sent
    return await this.getChatroomsOnly(_userid, _type);
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
        order: {
          created_at: 'DESC',
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
        order: {
          created_at: 'DESC',
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

  private async getChatroomsWithLatestMessage(_userid: number, _type: number) {
    //detect if user == normal user ? company user
    //get chatrooms where user is participant
    //get lastest message of messages send to user or from user
    //get chatrooms from chatroomid_fk = chatroom_id
    //if user = normal user
    let chatroomListWithMessages: any[] = [];
    if (_type === 0) {
      const particpatedChatrooms = await this.ChatroomRepo.find({
        select: ['chatroom_id', 'normal_userid_fk', 'company_userid_fk'],
        where: {
          normal_userid_fk: _userid,
        },
      });
      //get latest message of chatrooms
      const chatroomsWithLatestMessage = await Promise.all(
        particpatedChatrooms.map(async (chatroom) => {
          const latestMessage = await this.MessagesRepo.findOneOrFail({
            select: [
              'message_id',
              'message',
              'message_created_at',
              'chatroomid_fk',
            ],
            where: {
              chatroomid_fk: chatroom.chatroom_id,
            },
            order: {
              message_created_at: 'ASC',
            },
          });
          return {
            ...chatroom,
            latestMessage,
          };
        }),
      );
      //get chatrooms where chatroomid_fk = chatroom_id
      chatroomListWithMessages.push(...chatroomsWithLatestMessage);
      const chatroomListWithUserData: any = [];
      await Promise.all(
        chatroomsWithLatestMessage.map(async (chatroom) => {
          const chatroomWithUserData = await this.getChatroomsOnly(
            chatroom.normal_userid_fk,
            0,
          );
          chatroomListWithUserData.push(chatroomWithUserData);
          Logger.log(chatroom);
          return chatroom;
        }),
      );
      return chatroomListWithUserData;
    } else if (_type === 1) {
      //user is company
      const particpatedChatrooms = await this.ChatroomRepo.find({
        select: ['chatroom_id', 'normal_userid_fk', 'normal_userid_fk'],
        where: {
          company_userid_fk: _userid,
        },
      });
      //get latest message of chatrooms
      const chatroomsWithLatestMessage = await Promise.all(
        particpatedChatrooms.map(async (chatroom) => {
          const latestMessage = await this.MessagesRepo.findOneOrFail({
            select: [
              'message_id',
              'message',
              'message_created_at',
              'chatroomid_fk',
            ],
            where: {
              chatroomid_fk: chatroom.chatroom_id,
            },
            order: {
              message_created_at: 'ASC',
            },
          });
          return {
            ...chatroom,
            latestMessage,
          };
        }),
      );
      //get chatrooms where chatroomid_fk = chatroom_id
      const chatroomListWithUserData: any = [];
      await Promise.all(
        chatroomsWithLatestMessage.map(async (chatroom) => {
          const chatroomWithUserData = await this.getChatroomsOnly(
            chatroom.company_userid_fk,
            0,
          );
          chatroomListWithUserData.push(chatroomWithUserData);
          return chatroom;
        }),
      );
      return chatroomListWithUserData;
    }
  }

  /*
   * 1. Check if user already send messages
   * 2. If not, get only chatrooms where user is sender or receiver
   * 3. If yes, get all chatrooms and messages where user is sender or receiver
   *
   */

  async getMessages(_chatroomid_fk: number) {
    //get messages from messages where chatroomid_fk = _chartroomid_fk order by message_created_at desc
    return this.MessagesRepo.find({
      select: ['message_id', 'message', 'message_created_at', 'userid_fk'],
      where: {
        chatroomid_fk: _chatroomid_fk,
      },
      order: {
        message_created_at: 'ASC',
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
