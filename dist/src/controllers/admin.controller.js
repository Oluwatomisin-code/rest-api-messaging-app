"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const user_service_1 = require("../services/user.service");
const stats_service_1 = require("../services/stats.service");
class AdminController {
    constructor() {
        this.adminService = new admin_service_1.AdminService();
        this.userService = new user_service_1.UserService();
        this.statsService = new stats_service_1.StatsService();
    }
    async login(req, res) {
        try {
            const result = await this.adminService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async getAdmins(_, res) {
        try {
            const result = await this.adminService.getAllAdmins();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async createAdmin(req, res) {
        try {
            const result = await this.adminService.createAdmin(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getUsers(req, res) {
        try {
            const result = await this.userService.getAllUsers();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getUser(req, res) {
        try {
            const result = await this.userService.getUserById(req.params.userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            await this.userService.deleteUser(req.params.userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getStats(_, res) {
        try {
            const result = await this.statsService.getSystemStats();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map