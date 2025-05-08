"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const Message_1 = require("../models/Message");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
class MessageService extends base_service_1.BaseService {
    constructor() {
        super(Message_1.Message);
    }
    async createMessage(data) {
        return await this.create(data);
    }
    async getUserMessages(userId) {
        return await Message_1.Message.find({ userId });
    }
    async getMessage(messageId, userId) {
        const message = await Message_1.Message.findOne({ _id: messageId, userId });
        if (!message) {
            throw new AppError_1.AppError("Message not found", 404);
        }
        return message;
    }
    async deleteMessage(messageId, userId) {
        const message = await Message_1.Message.findOneAndDelete({ _id: messageId, userId });
        if (!message) {
            throw new AppError_1.AppError("Message not found", 404);
        }
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map