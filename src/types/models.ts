import { Document, ObjectId, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  isVerified: boolean;
  verificationToken: string | null;
  role: "user";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  role: "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IMessage extends Document {
  sender: ObjectId;
  recipient?: ObjectId;
  group?: ObjectId;
  content: string;
  messageType: "direct" | "group";
  isRead: boolean;
  createdAt: Date;
}

export interface IGroup extends Document {
  name: string;
  description: string;
  members: ObjectId[];
  createdBy: ObjectId;
  isActive: boolean;
  createdAt: Date;
}

// Model types for use in services
export type UserModel = Model<IUser>;
export type AdminModel = Model<IAdmin>;
export type MessageModel = Model<IMessage>;
export type GroupModel = Model<IGroup>;
