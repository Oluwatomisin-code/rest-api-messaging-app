"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const dotenv_1 = __importDefault(require("dotenv"));
const Admin_1 = require("../src/models/Admin");
dotenv_1.default.config();
const defaultAdmin = {
    firstName: "Admin",
    lastName: "User",
    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
    isSuperAdmin: true,
};
async function seedAdmin() {
    const existing = await Admin_1.Admin.findOne({ email: defaultAdmin.email });
    if (!existing) {
        await Admin_1.Admin.create({
            firstName: defaultAdmin.firstName,
            lastName: defaultAdmin.lastName,
            email: defaultAdmin.email,
            password: defaultAdmin.password,
            isSuperAdmin: defaultAdmin.isSuperAdmin,
        });
        console.log("Seed admin created.");
    }
    else {
        console.log("Seed admin already exists.");
    }
}
//# sourceMappingURL=adminSeeder.js.map