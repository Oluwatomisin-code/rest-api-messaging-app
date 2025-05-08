import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";
import { Admin } from "../models/Admin";

export interface AuthRequest extends Request {
  user?: any;
  role?: "user" | "admin";
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (decoded.role === "user") {
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      req.user = user;
      req.role = "user";
    } else if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        res.status(401).json({ message: "Admin not found" });
        return;
      }
      req.user = admin;
      req.role = "admin";
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (roles: ("user" | "admin")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.role || !roles.includes(req.role)) {
      res.status(403).json({ message: "Unauthorized access" });
      return;
    }
    next();
  };
};
