"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
dotenv_1.default.config();
const dbConfig = config_1.config.db;
const pool = new pg_1.Pool(dbConfig);
pool
    .connect()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("Error connecting to database", err));
exports.default = pool;
