"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const Admin_1 = require("../models/Admin");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
class AdminService extends base_service_1.BaseService {
    constructor() {
        super(Admin_1.Admin);
    }
    async login(data) {
        const admin = await Admin_1.Admin.findOne({ email: data.email });
        if (!admin) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, admin.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const token = (0, jwt_1.signToken)({ id: admin.id, role: "admin" });
        return { token, admin };
    }
    async createAdmin(data) {
        const existingAdmin = await Admin_1.Admin.findOne({ email: data.email });
        if (existingAdmin) {
            throw new AppError_1.AppError("Email already registered", 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        return await this.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
    }
    async getAllAdmins() {
        return await this.findAll();
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map