"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
class EmailService {
    constructor() {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("Email credentials (EMAIL_USER and EMAIL_PASS) must be set in environment variables");
        }
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "tomisintomori@gmail.com",
                pass: "rmnt xifu zfee rseq",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.API_URL}/verify-email.html?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email address",
            html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not request this verification, please ignore this email.</p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            logger_1.logger.info(`Verification email sent to ${email}`);
        }
        catch (error) {
            logger_1.logger.error("Error sending verification email:", error);
            throw new Error("Failed to send verification email");
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map