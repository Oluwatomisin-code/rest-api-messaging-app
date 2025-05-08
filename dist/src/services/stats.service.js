"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const User_1 = require("../models/User");
const Admin_1 = require("../models/Admin");
const Message_1 = require("../models/Message");
const Group_1 = require("../models/Group");
class StatsService {
    async getSystemStats() {
        const [totalUsers, totalAdmins, totalMessages, totalGroups, verifiedUsers] = await Promise.all([
            User_1.User.countDocuments(),
            Admin_1.Admin.countDocuments(),
            Message_1.Message.countDocuments(),
            Group_1.Group.countDocuments(),
            User_1.User.countDocuments({ isVerified: true }),
        ]);
        return {
            totalUsers,
            totalAdmins,
            totalMessages,
            totalGroups,
            verifiedUsers,
            verificationRate: (verifiedUsers / totalUsers) * 100,
        };
    }
}
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map