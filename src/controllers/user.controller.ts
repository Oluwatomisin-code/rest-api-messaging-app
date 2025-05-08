import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { UserService } from "../services/user.service";
import { MessageService } from "../services/message.service";
import { GroupService } from "../services/group.service";

export class UserController {
  private userService: UserService;
  private messageService: MessageService;
  private groupService: GroupService;

  constructor() {
    this.userService = new UserService();
    this.messageService = new MessageService();
    this.groupService = new GroupService();
  }

  // Auth methods
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.verifyEmail(req.body.token);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.resendVerification(req.body.email);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Message methods
  async createMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.messageService.createMessage({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.messageService.getUserMessages(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.messageService.getMessage(
        req.params.messageId,
        req.user.id
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      await this.messageService.deleteMessage(
        req.params.messageId,
        req.user.id
      );
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Group methods
  async getGroups(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.groupService.getUserGroups(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createGroup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.groupService.createGroup({
        ...req.body,
        creatorId: req.user.id,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async joinGroup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.groupService.joinGroup(
        req.params.groupId,
        req.user.id
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async leaveGroup(req: AuthRequest, res: Response): Promise<void> {
    try {
      await this.groupService.leaveGroup(req.params.groupId, req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
