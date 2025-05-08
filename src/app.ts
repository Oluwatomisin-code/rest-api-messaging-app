import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import swaggerUiDist from "swagger-ui-dist";
import fs from "fs";
import YAML from "yaml";
import morgan from "morgan";
import { stream } from "./utils/logger";
import path from "path";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

const userSwaggerDoc = YAML.parse(
  fs.readFileSync(path.join(__dirname, "../swagger/user.yaml"), "utf8")
);
const adminSwaggerDoc = YAML.parse(
  fs.readFileSync(path.join(__dirname, "../swagger/admin.yaml"), "utf8")
);

console.log("User Swagger Title:", userSwaggerDoc.info.title);
console.log("Admin Swagger Title:", adminSwaggerDoc.info.title);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(morgan("combined", { stream }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve static Swagger UI files
app.use("/swagger-ui", express.static(swaggerUiDist.getAbsoluteFSPath()));

// Serve user docs
app.get("/api/docs/user", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>User API Docs</title>
        <link rel="stylesheet" type="text/css" href="/swagger-ui/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/swagger-ui/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            SwaggerUIBundle({
              url: '/api/docs/user/swagger.json',
              dom_id: '#swagger-ui'
            });
          };
        </script>
      </body>
    </html>
  `);
});
app.get("/api/docs/user/swagger.json", function (req, res) {
  res.json(userSwaggerDoc);
});

// Serve admin docs
app.get("/api/docs/admin", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Admin API Docs</title>
        <link rel="stylesheet" type="text/css" href="/swagger-ui/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/swagger-ui/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            SwaggerUIBundle({
              url: '/api/docs/admin/swagger.json',
              dom_id: '#swagger-ui'
            });
          };
        </script>
      </body>
    </html>
  `);
});
app.get("/api/docs/admin/swagger.json", function (req, res) {
  res.json(adminSwaggerDoc);
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use(errorHandler as ErrorRequestHandler);

export default app;
