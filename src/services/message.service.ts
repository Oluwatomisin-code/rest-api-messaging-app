import { Message } from "../models/Message";
import { BaseService } from "./base.service";
import { AppError } from "../utils/AppError";
import { CreateMessageDto } from "../dtos/user.dto";
import { IMessage } from "../types/models";

export class MessageService extends BaseService<IMessage> {
  constructor() {
    super(Message);
  }

  async createMessage(
    data: CreateMessageDto & { userId: string }
  ): Promise<IMessage> {
    return await this.create(data);
  }

  async getUserMessages(userId: string): Promise<IMessage[]> {
    return await Message.find({ userId });
  }

  async getMessage(messageId: string, userId: string): Promise<IMessage> {
    const message = await Message.findOne({ _id: messageId, userId });
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    return message;
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await Message.findOneAndDelete({ _id: messageId, userId });
    if (!message) {
      throw new AppError("Message not found", 404);
    }
  }
}
