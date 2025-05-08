import { User } from "../models/User";
import { BaseService } from "./base.service";
import { AppError } from "../utils/AppError";
import { hash, compare } from "bcryptjs";
import { signToken } from "../utils/jwt";
import { RegisterUserDto, LoginUserDto } from "../dtos/user.dto";
import { IUser } from "../types/models";
import { EmailService } from "./email.service";
import { generateVerificationToken } from "../utils/verificationToken";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async register(data: RegisterUserDto): Promise<{ message: string }> {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new AppError("Email already registered", 400);
      }

      const hashedPassword = await hash(data.password, 12);
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        country: data.country,
        isVerified: false,
        verificationToken: generateVerificationToken(),
        role: "user" as const,
      };

      const user = await this.create(userData);

      // Send verification email using EmailService
      const emailService = new EmailService();
      await emailService.sendVerificationEmail(
        user.email,
        user.verificationToken as string
      );

      return {
        message:
          "Registration successful. Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new AppError(error.message || "Error creating entity", 400);
    }
  }

  async login(data: LoginUserDto): Promise<{ token: string; user: IUser }> {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = signToken({ id: user.id, role: "user" });
    return { token, user };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    console.log("we got here in service", token);
    const user = await User.findOne({ verificationToken: token });
    console.log(user, "user");
    if (!user) {
      throw new AppError("Invalid verification token", 400);
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    return { message: "Email verified successfully" };
  }
  async resendVerification(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
      throw new AppError("User already verified", 400);
    }

    // Generate new verification token and send email
    // Implementation depends on your email service
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.findAll();
  }

  async getUserById(id: string): Promise<IUser> {
    return await this.findById(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(id);
  }
}
