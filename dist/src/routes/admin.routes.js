"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const validate_1 = require("../middlewares/validate");
const admin_controller_1 = require("../controllers/admin.controller");
const admin_dto_1 = require("../dtos/admin.dto");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.post("/auth/login", rateLimiter_1.authLimiter, (0, validate_1.validateDto)(admin_dto_1.LoginAdminDto), adminController.login.bind(adminController));
router.get("/admins", auth_1.authenticate, (0, auth_1.requireRole)(["admin"]), rateLimiter_1.apiLimiter, adminController.getAdmins.bind(adminController));
router.post("/admins", auth_1.authenticate, (0, auth_1.requireRole)(["admin"]), rateLimiter_1.apiLimiter, (0, validate_1.validateDto)(admin_dto_1.CreateAdminDto), adminController.createAdmin.bind(adminController));
router.get("/users", auth_1.authenticate, (0, auth_1.requireRole)(["admin"]), rateLimiter_1.apiLimiter, adminController.getUsers.bind(adminController));
router.get("/users/:userId", auth_1.authenticate, (0, auth_1.requireRole)(["admin"]), rateLimiter_1.apiLimiter, adminController.getUser.bind(adminController));
router.delete("/users/:userId", auth_1.authenticate, (0, auth_1.requireRole)(["admin"]), rateLimiter_1.apiLimiter, adminController.deleteUser.bind(adminController));
router.get("/stats", auth_1.authenticate, (0, auth_1.requireRole)(["admin"]), rateLimiter_1.apiLimiter, adminController.getStats.bind(adminController));
exports.default = router;
//# sourceMappingURL=admin.routes.js.map