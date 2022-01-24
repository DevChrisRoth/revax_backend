import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatroom } from '../message/chatroom.entity';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private ChatroomRepository: Repository<Chatroom>,
  ) {}
}
