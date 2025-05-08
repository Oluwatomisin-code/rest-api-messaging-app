import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { AdminService } from "../services/admin.service";
import { UserService } from "../services/user.service";
import { StatsService } from "../services/stats.service";

export class AdminController {
  private adminService: AdminService;
  private userService: UserService;
  private statsService: StatsService;

  constructor() {
    this.adminService = new AdminService();
    this.userService = new UserService();
    this.statsService = new StatsService();
  }

  // Auth methods
  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  // Admin management
  async getAdmins(_: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.adminService.getAllAdmins();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.adminService.createAdmin(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // User management
  async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.userService.getAllUsers();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.userService.getUserById(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      await this.userService.deleteUser(req.params.userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // System statistics
  async getStats(_: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.statsService.getSystemStats();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
