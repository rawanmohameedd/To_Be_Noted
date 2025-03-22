"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_1 = require("./utils/swagger");
const path_1 = __importDefault(require("path"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);
//setUp swagger
// Middleware
app.use((0, helmet_1.default)()); // sets secures http headers
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 request for every 15 min.
//specify allowed origins
app.use((0, cors_1.default)({
    origin: 'https://to-be-noted.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// Serve Swagger UI assets
app.use('/swagger-ui', express_1.default.static(path_1.default.join(__dirname, '../node_modules/swagger-ui-dist')));
(0, swagger_1.setupSwagger)(app);
// Routes
app.use("/auth", auth_routes_1.default);
app.use("/api", tasks_routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/debug-swagger-ui-bundle', (req, res) => {
    res.send('This should be the swagger-ui-bundle.js file');
});
app.get('/debug-headers', (req, res) => {
    res.json({
        headers: req.headers,
        path: req.path,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl
    });
});
// Connect to database
(0, db_1.default)()
    .then(() => {
    // Start server after successful DB connection
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
});
exports.default = app;
