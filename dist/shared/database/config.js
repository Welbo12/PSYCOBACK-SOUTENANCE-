"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT, 10),
    jwtSecret: process.env.JWT_SECRET,
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSLMODE === "require",
    },
    sendgridApiKey: process.env.SENDGRID_API,
    sendgridFrom: process.env.SENDGRID_FROM,
    frontendUrl: process.env.FRONTEND_URL,
};
exports.default = exports.config;
