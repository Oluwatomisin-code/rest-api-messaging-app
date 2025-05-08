"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const sockets_1 = require("./sockets");
const logger_1 = require("./utils/logger");
const adminSeeder_1 = require("../seed/adminSeeder");
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
(0, sockets_1.setupSockets)(io);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(async () => {
    logger_1.logger.info("MongoDB connected");
    await (0, adminSeeder_1.seedAdmin)();
    server.listen(PORT, () => {
        logger_1.logger.info(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    logger_1.logger.error("MongoDB connection error", err);
});
//# sourceMappingURL=index.js.map