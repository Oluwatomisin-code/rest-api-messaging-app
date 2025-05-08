import winston from "winston";
import "winston-daily-rotate-file";
import { StreamOptions } from "morgan";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Create a stream object for Morgan
const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, stream };
