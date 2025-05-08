import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { setupSockets } from "./sockets";
import { logger } from "./utils/logger";
import { seedAdmin } from "../seed/adminSeeder";

dotenv.config();

const PORT = process.env.PORT || 8000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
setupSockets(io);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(async () => {
    logger.info("MongoDB connected");
    await seedAdmin();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error", err);
  });
