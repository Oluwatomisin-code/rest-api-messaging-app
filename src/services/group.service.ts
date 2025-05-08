import { Group } from "../models/Group";
import { BaseService } from "./base.service";
import { AppError } from "../utils/AppError";
import { CreateGroupDto } from "../dtos/user.dto";
import { IGroup } from "../types/models";
import { Schema } from "mongoose";

export class GroupService extends BaseService<IGroup> {
  constructor() {
    super(Group);
  }

  async createGroup(
    data: CreateGroupDto & { creatorId: string }
  ): Promise<IGroup> {
    const group = await this.create({
      ...data,
      members: [data.creatorId as any],
      createdBy: data.creatorId as any,
    });
    return group;
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    return await Group.find({ members: userId as any });
  }

  async joinGroup(groupId: string, userId: string): Promise<IGroup> {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new AppError("Group not found", 404);
    }

    if (group.members.some((id) => id.toString() === userId)) {
      throw new AppError("User already in group", 400);
    }

    group.members.push(userId as any);
    await group.save();
    return group;
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new AppError("Group not found", 404);
    }

    if (!group.members.some((id) => id.toString() === userId)) {
      throw new AppError("User not in group", 400);
    }

    group.members = group.members.filter((id) => id.toString() !== userId);
    await group.save();
  }
}
