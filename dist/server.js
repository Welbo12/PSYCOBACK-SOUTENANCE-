"use strict";
// import express from "express";
// import { Request, Response } from "express";
// import pool from "./shared/database/client";
// import AuthRoutes from "./features/auth/Auth.routes";
// import JournalRoutes from "./features/JournalIntime/Journal.routes";
// import DeviceRoutes from "./features/Notification/Device/Device.routes";
// import EmergencieRoutes from "./features/Notification/Emergencie/Emergencie.routes";
// import ResourceRoutes from "./features/Resources/resource.route";
// import cors from "cors";
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
// const app = express();
// app.use(express.json());
// app.use(cors());
// const PORT = 3000;
// const API_URL = "http://localhost:3000";
// app.get("/", (req: Request, res: Response) => {
//   res.send("Juste un simple serveur express avec TypeScript !");
// });
// app.get("/test",  async function(req: Request, res: Response)  {
//     try {
//         const result = await pool.query('SELECT NOW() as now;');
//         res.status(200).json({
//             message:"l'heure actuelle dans la base de données est : " + result.rows[0].now,
//             timeStamp: new Date().toISOString(),
//             uptime: process.uptime(),});
//     }
//     catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//         console.error(err);
//     }
// });
// app.get("/healthCheck", (req: Request, res: Response) => {
//   res.status(200).json({
//     status: "ok",
//     message: "Serveur en ligne",
//     timeStamp: new Date().toISOString(),
//     uptime: process.uptime(),
//   });
// });
// app.use("/api/auth",  AuthRoutes);
// app.listen(PORT, () => {
//   console.log("le serveur est lancé sur le port : " + API_URL);
// });
// app.use("/api/Journal", JournalRoutes);
// app.use("/api/device", DeviceRoutes);
// app.use("/api/emergency", EmergencieRoutes);
// app.use("/api/resources", ResourceRoutes);
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("./shared/database/client"));
const Auth_routes_1 = __importDefault(require("./features/auth/Auth.routes"));
const Journal_routes_1 = __importDefault(require("./features/JournalIntime/Journal.routes"));
const Device_routes_1 = __importDefault(require("./features/Notification/Device/Device.routes"));
const Emergencie_routes_1 = __importDefault(require("./features/Notification/Emergencie/Emergencie.routes"));
const resource_route_1 = __importDefault(require("./features/Resources/resource.route"));
const cors_1 = __importDefault(require("cors"));
// Importer la fonction
const runCreateAdmin_1 = require("./shared/script/runCreateAdmin");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3000;
const API_URL = "http://localhost:3000";
// Routes publiques
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
// Routes API
app.use("/api/auth", Auth_routes_1.default);
app.use("/api/Journal", Journal_routes_1.default);
app.use("/api/device", Device_routes_1.default);
app.use("/api/emergency", Emergencie_routes_1.default);
app.use("/api/resources", resource_route_1.default);
//  Démarrage serveur avec création automatique de l’admin
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, runCreateAdmin_1.ensureAdmin)(); // crée ou récupère l’admin avant de lancer le serveur
        // S'assurer que la table de planification de suppression existe
        yield client_1.default.query(`
    CREATE TABLE IF NOT EXISTS account_deletion_request (
      user_id UUID PRIMARY KEY,
      delete_after TIMESTAMP NOT NULL
    );
  `);
        // Table des disponibilités
        yield client_1.default.query(`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id SERIAL PRIMARY KEY,
      provider_id VARCHAR(64) NOT NULL,
      slot_time TIMESTAMP NOT NULL,
      is_booked BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(provider_id, slot_time)
    );
  `);
        app.listen(PORT, () => {
            console.log(" Le serveur est lancé sur le port : " + API_URL);
        });
    });
}
startServer();
