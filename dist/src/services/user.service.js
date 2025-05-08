"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = require("../utils/jwt");
const email_service_1 = require("./email.service");
const verificationToken_1 = require("../utils/verificationToken");
class UserService extends base_service_1.BaseService {
    constructor() {
        super(User_1.User);
    }
    async register(data) {
        try {
            const existingUser = await User_1.User.findOne({ email: data.email });
            if (existingUser) {
                throw new AppError_1.AppError("Email already registered", 400);
            }
            const hashedPassword = await (0, bcryptjs_1.hash)(data.password, 12);
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword,
                country: data.country,
                isVerified: false,
                verificationToken: (0, verificationToken_1.generateVerificationToken)(),
                role: "user",
            };
            const user = await this.create(userData);
            const emailService = new email_service_1.EmailService();
            await emailService.sendVerificationEmail(user.email, user.verificationToken);
            return {
                message: "Registration successful. Please check your email to verify your account.",
            };
        }
        catch (error) {
            console.error("Registration error:", error);
            throw new AppError_1.AppError(error.message || "Error creating entity", 400);
        }
    }
    async login(data) {
        const user = await User_1.User.findOne({ email: data.email });
        if (!user) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const token = (0, jwt_1.signToken)({ id: user.id, role: "user" });
        return { token, user };
    }
    async verifyEmail(token) {
        console.log("we got here in service", token);
        const user = await User_1.User.findOne({ verificationToken: token });
        console.log(user, "user");
        if (!user) {
            throw new AppError_1.AppError("Invalid verification token", 400);
        }
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        return { message: "Email verified successfully" };
    }
    async resendVerification(email) {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        if (user.isVerified) {
            throw new AppError_1.AppError("User already verified", 400);
        }
    }
    async getAllUsers() {
        return await this.findAll();
    }
    async getUserById(id) {
        return await this.findById(id);
    }
    async deleteUser(id) {
        await this.delete(id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map