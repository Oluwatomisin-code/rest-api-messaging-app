"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const message_service_1 = require("../services/message.service");
const group_service_1 = require("../services/group.service");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.messageService = new message_service_1.MessageService();
        this.groupService = new group_service_1.GroupService();
    }
    async register(req, res) {
        try {
            const result = await this.userService.register(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const result = await this.userService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async verifyEmail(req, res) {
        try {
            const result = await this.userService.verifyEmail(req.body.token);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async resendVerification(req, res) {
        try {
            const result = await this.userService.resendVerification(req.body.email);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async createMessage(req, res) {
        try {
            const result = await this.messageService.createMessage(Object.assign(Object.assign({}, req.body), { userId: req.user.id }));
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getMessages(req, res) {
        try {
            const result = await this.messageService.getUserMessages(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getMessage(req, res) {
        try {
            const result = await this.messageService.getMessage(req.params.messageId, req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteMessage(req, res) {
        try {
            await this.messageService.deleteMessage(req.params.messageId, req.user.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getGroups(req, res) {
        try {
            const result = await this.groupService.getUserGroups(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async createGroup(req, res) {
        try {
            const result = await this.groupService.createGroup(Object.assign(Object.assign({}, req.body), { creatorId: req.user.id }));
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async joinGroup(req, res) {
        try {
            const result = await this.groupService.joinGroup(req.params.groupId, req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async leaveGroup(req, res) {
        try {
            await this.groupService.leaveGroup(req.params.groupId, req.user.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map