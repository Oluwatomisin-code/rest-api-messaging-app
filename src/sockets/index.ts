import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Group } from "../models/Group";
import { logger } from "../utils/logger";

interface SocketUser {
  userId: string;
  socketId: string;
}

const connectedUsers: SocketUser[] = [];

export const setupSockets = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    connectedUsers.push({ userId: user._id.toString(), socketId: socket.id });
    logger.info(`User connected: ${user._id}`);

    // Handle direct messages
    socket.on("direct-message", async (data) => {
      try {
        const { recipientId, content } = data;
        const message = await Message.create({
          sender: user._id,
          recipient: recipientId,
          content,
          messageType: "direct",
        });

        const recipientSocket = connectedUsers.find(
          (u) => u.userId === recipientId
        );

        if (recipientSocket) {
          io.to(recipientSocket.socketId).emit("new-message", message);
        }
      } catch (error) {
        logger.error("Error sending direct message:", error);
      }
    });

    // Handle group messages
    socket.on("group-message", async (data) => {
      try {
        const { groupId, content } = data;
        const group = await Group.findById(groupId);

        if (!group || !group.members.includes(user._id)) {
          throw new Error("Not a member of this group");
        }

        const message = await Message.create({
          sender: user._id,
          group: groupId,
          content,
          messageType: "group",
        });

        // Populate sender information with more fields
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name firstName lastName email")
          .lean();

        // Emit to all group members
        group.members.forEach((memberId) => {
          const memberSocket = connectedUsers.find(
            (u) => u.userId === memberId.toString()
          );
          if (memberSocket) {
            io.to(memberSocket.socketId).emit(
              "new-group-message",
              populatedMessage
            );
          }
        });
      } catch (error) {
        logger.error("Error sending group message:", error);
      }
    });

    // Handle joining groups
    socket.on("join-group", async (groupId) => {
      try {
        const group = await Group.findById(groupId);
        if (group && group.members.includes(user._id)) {
          socket.join(`group-${groupId}`);
          logger.info(`User ${user._id} joined group ${groupId}`);
        }
      } catch (error) {
        logger.error("Error joining group:", error);
      }
    });

    // Handle leaving groups
    socket.on("leave-group", (groupId) => {
      socket.leave(`group-${groupId}`);
      logger.info(`User ${user._id} left group ${groupId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const index = connectedUsers.findIndex(
        (u) => u.userId === user._id.toString()
      );
      if (index !== -1) {
        connectedUsers.splice(index, 1);
      }
      logger.info(`User disconnected: ${user._id}`);
    });
  });
};
