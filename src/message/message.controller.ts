import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Chatroom } from './chatroom.entity';
import { MessageService } from './message.service';
import { Messages } from './messages.entity';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('chatrooms')
  async getChatrooms(@Request() req: any): Promise<
    | Chatroom[]
    | {
        status: string;
      }
  > {
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
  async removeChatrooms(@Request() req: any): Promise<{
    status: string;
  }> {
    try {
      return await this.messageService.removeChatroom(req.body['chatroomid']);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('messages/:id') //✅  (get 50 messages of je chatroom)
  async getMessages(@Param('id') chatroomid: any): Promise<
    | Messages[]
    | {
        status: string;
      }
  > {
    try {
      return await this.messageService.getMessages(chatroomid);
    } catch (error) {
      return { status: 'failed' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(200)
  @Post('messages') //✅ (get 50 messages of je chatroom)
  async sendMessage(@Request() req: any): Promise<{
    status: string;
  }> {
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
