// import express from "express";
// import { Request, Response } from "express";
// import pool from "./shared/database/client";
// import AuthRoutes from "./features/auth/Auth.routes";
// import JournalRoutes from "./features/JournalIntime/Journal.routes";
// import DeviceRoutes from "./features/Notification/Device/Device.routes";
// import EmergencieRoutes from "./features/Notification/Emergencie/Emergencie.routes";
// import ResourceRoutes from "./features/Resources/resource.route";
// import cors from "cors";



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

import express from "express";
import { Request, Response } from "express";
import pool from "./shared/database/client";
import AuthRoutes from "./features/auth/Auth.routes";
import JournalRoutes from "./features/JournalIntime/Journal.routes";
import DeviceRoutes from "./features/Notification/Device/Device.routes";
import EmergencieRoutes from "./features/Notification/Emergencie/Emergencie.routes";
import ResourceRoutes from "./features/Resources/resource.route";
import AvailabilityRoutes from "./features/Availability/Availability.routes";
import ChatRoutes from "./features/Chat/Chat.routes";
import { ChatGateway } from "./features/Chat/Chat.gateway";
import cors from "cors";


// Importer la fonction
import { ensureAdmin } from "./shared/script/runCreateAdmin";

const app = express();
app.use(express.json());
app.use(cors());

// const PORT = 3000;
// const API_URL = "http://localhost:3000";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Routes publiques
app.get("/", (req: Request, res: Response) => {
  res.send("Juste un simple serveur express avec TypeScript !");
});

app.get("/test",  async function(req: Request, res: Response)  {
  try {
      const result = await pool.query('SELECT NOW() as now;');
      res.status(200).json({
          message:"l'heure actuelle dans la base de données est : " + result.rows[0].now,
          timeStamp: new Date().toISOString(),
          uptime: process.uptime(),
      });
  }
  catch (err) {
      res.status(500).json({ error: "Internal server error" });
      console.error(err);
  }
});

app.get("/healthCheck", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Serveur en ligne",
    timeStamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes API
app.use("/api/auth", AuthRoutes);
app.use("/api/Journal", JournalRoutes);
app.use("/api/device", DeviceRoutes);
app.use("/api/emergency", EmergencieRoutes);
app.use("/api/resources", ResourceRoutes);
app.use("/api/availability", AvailabilityRoutes);
app.use("/api/chat", ChatRoutes);


//  Démarrage serveur avec création automatique de l’admin
async function startServer() {
  await ensureAdmin(); // crée ou récupère l’admin avant de lancer le serveur
// S'assurer que la table de planification de suppression existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS account_deletion_request (
      user_id UUID PRIMARY KEY,
      delete_after TIMESTAMP NOT NULL
    );
  `);
    // Table des disponibilités
  await pool.query(`
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
    // console.log(" Le serveur est lancé sur le port : " + API_URL);
       console.log("🚀 Le serveur est lancé sur le port : " + PORT);
  
  });
}

startServer();
