"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const swagger_ui_dist_1 = __importDefault(require("swagger-ui-dist"));
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./utils/logger");
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
const userSwaggerDoc = yaml_1.default.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../swagger/user.yaml"), "utf8"));
const adminSwaggerDoc = yaml_1.default.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../swagger/admin.yaml"), "utf8"));
console.log("User Swagger Title:", userSwaggerDoc.info.title);
console.log("Admin Swagger Title:", adminSwaggerDoc.info.title);
app.use((0, helmet_1.default)({
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
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, morgan_1.default)("combined", { stream: logger_1.stream }));
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/swagger-ui", express_1.default.static(swagger_ui_dist_1.default.getAbsoluteFSPath()));
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
app.use("/api/user", user_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map