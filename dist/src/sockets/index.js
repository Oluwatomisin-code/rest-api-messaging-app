"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSockets = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const Message_1 = require("../models/Message");
const Group_1 = require("../models/Group");
const logger_1 = require("../utils/logger");
const connectedUsers = [];
const setupSockets = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            const decoded = (0, jwt_1.verifyToken)(token);
            const user = await User_1.User.findById(decoded.id);
            if (!user) {
                return next(new Error("User not found"));
            }
            socket.data.user = user;
            next();
        }
        catch (error) {
            next(new Error("Authentication error"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;
        connectedUsers.push({ userId: user._id.toString(), socketId: socket.id });
        logger_1.logger.info(`User connected: ${user._id}`);
        socket.on("direct-message", async (data) => {
            try {
                const { recipientId, content } = data;
                const message = await Message_1.Message.create({
                    sender: user._id,
                    recipient: recipientId,
                    content,
                    messageType: "direct",
                });
                const recipientSocket = connectedUsers.find((u) => u.userId === recipientId);
                if (recipientSocket) {
                    io.to(recipientSocket.socketId).emit("new-message", message);
                }
            }
            catch (error) {
                logger_1.logger.error("Error sending direct message:", error);
            }
        });
        socket.on("group-message", async (data) => {
            try {
                const { groupId, content } = data;
                const group = await Group_1.Group.findById(groupId);
                if (!group || !group.members.includes(user._id)) {
                    throw new Error("Not a member of this group");
                }
                const message = await Message_1.Message.create({
                    sender: user._id,
                    group: groupId,
                    content,
                    messageType: "group",
                });
                const populatedMessage = await Message_1.Message.findById(message._id)
                    .populate("sender", "name firstName lastName email")
                    .lean();
                group.members.forEach((memberId) => {
                    const memberSocket = connectedUsers.find((u) => u.userId === memberId.toString());
                    if (memberSocket) {
                        io.to(memberSocket.socketId).emit("new-group-message", populatedMessage);
                    }
                });
            }
            catch (error) {
                logger_1.logger.error("Error sending group message:", error);
            }
        });
        socket.on("join-group", async (groupId) => {
            try {
                const group = await Group_1.Group.findById(groupId);
                if (group && group.members.includes(user._id)) {
                    socket.join(`group-${groupId}`);
                    logger_1.logger.info(`User ${user._id} joined group ${groupId}`);
                }
            }
            catch (error) {
                logger_1.logger.error("Error joining group:", error);
            }
        });
        socket.on("leave-group", (groupId) => {
            socket.leave(`group-${groupId}`);
            logger_1.logger.info(`User ${user._id} left group ${groupId}`);
        });
        socket.on("disconnect", () => {
            const index = connectedUsers.findIndex((u) => u.userId === user._id.toString());
            if (index !== -1) {
                connectedUsers.splice(index, 1);
            }
            logger_1.logger.info(`User disconnected: ${user._id}`);
        });
    });
};
exports.setupSockets = setupSockets;
//# sourceMappingURL=index.js.map