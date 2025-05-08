import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth";
import { authLimiter, apiLimiter } from "../middlewares/rateLimiter";
import { validateDto } from "../middlewares/validate";
import { AdminController } from "../controllers/admin.controller";
import { LoginAdminDto, CreateAdminDto } from "../dtos/admin.dto";

const router = Router();
const adminController = new AdminController();

// Admin authentication
router.post(
  "/auth/login",
  authLimiter,
  validateDto(LoginAdminDto),
  adminController.login.bind(adminController)
);

// Admin management
router.get(
  "/admins",
  authenticate,
  requireRole(["admin"]),
  apiLimiter,
  adminController.getAdmins.bind(adminController)
);

router.post(
  "/admins",
  authenticate,
  requireRole(["admin"]),
  apiLimiter,
  validateDto(CreateAdminDto),
  adminController.createAdmin.bind(adminController)
);

// User management
router.get(
  "/users",
  authenticate,
  requireRole(["admin"]),
  apiLimiter,
  adminController.getUsers.bind(adminController)
);

router.get(
  "/users/:userId",
  authenticate,
  requireRole(["admin"]),
  apiLimiter,
  adminController.getUser.bind(adminController)
);

router.delete(
  "/users/:userId",
  authenticate,
  requireRole(["admin"]),
  apiLimiter,
  adminController.deleteUser.bind(adminController)
);

// System statistics
router.get(
  "/stats",
  authenticate,
  requireRole(["admin"]),
  apiLimiter,
  adminController.getStats.bind(adminController)
);

export default router;
