import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types/models";

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure either recipient or group is present, but not both
messageSchema.pre("validate", function (next) {
  if (this.messageType === "direct" && !this.recipient) {
    next(new Error("Recipient is required for direct messages"));
  } else if (this.messageType === "group" && !this.group) {
    next(new Error("Group is required for group messages"));
  } else if (this.recipient && this.group) {
    next(new Error("Message cannot have both recipient and group"));
  } else {
    next();
  }
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
