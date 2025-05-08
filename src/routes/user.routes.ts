import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth";
import { authLimiter, apiLimiter } from "../middlewares/rateLimiter";
import { validateDto } from "../middlewares/validate";
import { UserController } from "../controllers/user.controller";
import {
  RegisterUserDto,
  LoginUserDto,
  VerifyEmailDto,
  CreateMessageDto,
  CreateGroupDto,
} from "../dtos/user.dto";

const router = Router();
const userController = new UserController();

// Auth routes
router.post(
  "/auth/register",
  authLimiter,
  validateDto(RegisterUserDto),
  userController.register.bind(userController)
);

router.post(
  "/auth/login",
  authLimiter,
  validateDto(LoginUserDto),
  userController.login.bind(userController)
);

router.post(
  "/auth/verify-email",
  authLimiter,
  validateDto(VerifyEmailDto),
  userController.verifyEmail.bind(userController)
);

router.post(
  "/auth/resend-verification",
  authLimiter,
  userController.resendVerification.bind(userController)
);

// Message routes
router.post(
  "/messages",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  validateDto(CreateMessageDto),
  userController.createMessage.bind(userController)
);

router.get(
  "/messages",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  userController.getMessages.bind(userController)
);

router.get(
  "/messages/:messageId",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  userController.getMessage.bind(userController)
);

router.delete(
  "/messages/:messageId",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  userController.deleteMessage.bind(userController)
);

// Group routes
router.get(
  "/groups",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  userController.getGroups.bind(userController)
);

router.post(
  "/groups",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  validateDto(CreateGroupDto),
  userController.createGroup.bind(userController)
);

router.post(
  "/groups/:groupId/join",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  userController.joinGroup.bind(userController)
);

router.post(
  "/groups/:groupId/leave",
  authenticate,
  requireRole(["user"]),
  apiLimiter,
  userController.leaveGroup.bind(userController)
);

export default router;
