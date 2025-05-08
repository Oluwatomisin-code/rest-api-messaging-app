import { User } from "../models/User";
import { Admin } from "../models/Admin";
import { Message } from "../models/Message";
import { Group } from "../models/Group";

export class StatsService {
  async getSystemStats() {
    const [totalUsers, totalAdmins, totalMessages, totalGroups, verifiedUsers] =
      await Promise.all([
        User.countDocuments(),
        Admin.countDocuments(),
        Message.countDocuments(),
        Group.countDocuments(),
        User.countDocuments({ isVerified: true }),
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
