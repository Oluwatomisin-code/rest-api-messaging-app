"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const Admin_1 = require("../models/Admin");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (decoded.role === "user") {
            const user = await User_1.User.findById(decoded.id);
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            req.user = user;
            req.role = "user";
        }
        else if (decoded.role === "admin") {
            const admin = await Admin_1.Admin.findById(decoded.id);
            if (!admin) {
                res.status(401).json({ message: "Admin not found" });
                return;
            }
            req.user = admin;
            req.role = "admin";
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.role || !roles.includes(req.role)) {
            res.status(403).json({ message: "Unauthorized access" });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map