import nodemailer from "nodemailer";
import { logger } from "../utils/logger";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        "Email credentials (EMAIL_USER and EMAIL_PASS) must be set in environment variables"
      );
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // user: process.env.SMTP_USER,
        // pass: process.env.SMTP_PASS,
        user: "tomisintomori@gmail.com",

        pass: "rmnt xifu zfee rseq",
      },
      //disable certificate verification
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
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
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}
