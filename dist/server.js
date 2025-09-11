"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("./shared/database/client"));
const Auth_routes_1 = __importDefault(require("./features/auth/Auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
const API_URL = "http://localhost:3000";
app.get("/", (req, res) => {
    res.send("Juste un simple serveur express avec TypeScript !");
});
app.get("/test", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client_1.default.query('SELECT NOW() as now;');
            res.status(200).json({
                message: "l'heure actuelle dans la base de données est : " + result.rows[0].now,
                timeStamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        }
        catch (err) {
            res.status(500).json({ error: "Internal server error" });
            console.error(err);
        }
    });
});
app.get("/healthCheck", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Serveur en ligne",
        timeStamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.use("/api/auth", Auth_routes_1.default);
app.listen(PORT, () => {
    console.log("le serveur est lancé sur le port : " + API_URL);
});
