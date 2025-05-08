import dotenv from "dotenv";
import { Admin } from "../src/models/Admin";
import bcrypt from "bcryptjs";

dotenv.config();

const defaultAdmin = {
  firstName: "Admin",
  lastName: "User",
  email: process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com",
  password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
  isSuperAdmin: true,
};

export async function seedAdmin() {
  const existing = await Admin.findOne({ email: defaultAdmin.email });
  if (!existing) {
    await Admin.create({
      firstName: defaultAdmin.firstName,
      lastName: defaultAdmin.lastName,
      email: defaultAdmin.email,
      password: defaultAdmin.password,
      isSuperAdmin: defaultAdmin.isSuperAdmin,
    });
    console.log("Seed admin created.");
  } else {
    console.log("Seed admin already exists.");
  }
}
