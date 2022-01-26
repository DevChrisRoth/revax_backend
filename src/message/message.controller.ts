import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('chatrooms')
  async getChatrooms(@Request() req: any): Promise<any> {
    try {
      return await this.messageService.getAllChatroomsOfUser(
        req.user.userid,
        req.user.type,
      );
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('chatrooms') //✅
  async removeChatrooms(@Request() req: any): Promise<any> {
    try {
      return await this.messageService.removeChatroom(req.body['chatroomid']);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('messages') //✅  (get 50 messages of je chatroom)
  async getMessages(@Request() req: any): Promise<any> {
    try {
      return await this.messageService.getMessages(req.body['chatroomid']);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('messages') //✅ (get 50 messages of je chatroom)
  async sendMessage(@Request() req: any): Promise<any> {
    try {
      return await this.messageService.sendMessage(
        req.user.userid,
        req.body['chatroomid'],
        req.body['message'],
      );
    } catch (error) {
      return { status: 'failed' };
    }
  }
}
