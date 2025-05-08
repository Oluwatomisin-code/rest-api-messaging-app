import { Admin } from "../models/Admin";
import { BaseService } from "./base.service";
import { AppError } from "../utils/AppError";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { LoginAdminDto, CreateAdminDto } from "../dtos/admin.dto";
import { IAdmin } from "../types/models";

export class AdminService extends BaseService<IAdmin> {
  constructor() {
    super(Admin);
  }

  async login(data: LoginAdminDto): Promise<{ token: string; admin: IAdmin }> {
    const admin = await Admin.findOne({ email: data.email });
    if (!admin) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, admin.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = signToken({ id: admin.id, role: "admin" });
    return { token, admin };
  }

  async createAdmin(data: CreateAdminDto): Promise<IAdmin> {
    const existingAdmin = await Admin.findOne({ email: data.email });
    if (existingAdmin) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.create({
      ...data,
      password: hashedPassword,
    });
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    return await this.findAll();
  }
}
