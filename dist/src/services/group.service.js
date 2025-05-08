"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const Group_1 = require("../models/Group");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
class GroupService extends base_service_1.BaseService {
    constructor() {
        super(Group_1.Group);
    }
    async createGroup(data) {
        const group = await this.create(Object.assign(Object.assign({}, data), { members: [data.creatorId], createdBy: data.creatorId }));
        return group;
    }
    async getUserGroups(userId) {
        return await Group_1.Group.find({ members: userId });
    }
    async joinGroup(groupId, userId) {
        const group = await Group_1.Group.findById(groupId);
        if (!group) {
            throw new AppError_1.AppError("Group not found", 404);
        }
        if (group.members.some((id) => id.toString() === userId)) {
            throw new AppError_1.AppError("User already in group", 400);
        }
        group.members.push(userId);
        await group.save();
        return group;
    }
    async leaveGroup(groupId, userId) {
        const group = await Group_1.Group.findById(groupId);
        if (!group) {
            throw new AppError_1.AppError("Group not found", 404);
        }
        if (!group.members.some((id) => id.toString() === userId)) {
            throw new AppError_1.AppError("User not in group", 400);
        }
        group.members = group.members.filter((id) => id.toString() !== userId);
        await group.save();
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map