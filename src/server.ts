import express from "express";
import { Request, Response } from "express";
import pool from "./shared/database/client";
import AuthRoutes from "./features/auth/Auth.routes";


const app = express();
app.use(express.json());

const PORT = 3000;
const API_URL = "http://localhost:3000";

app.get("/", (req: Request, res: Response) => {
  res.send("Juste un simple serveur express avec TypeScript !");
});

app.get("/test",  async function(req: Request, res: Response)  {
    try {
        const result = await pool.query('SELECT NOW() as now;');
        res.status(200).json({
            message:"l'heure actuelle dans la base de données est : " + result.rows[0].now,
            timeStamp: new Date().toISOString(),
            uptime: process.uptime(),});
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

app.use("/api/auth",  AuthRoutes);

app.listen(PORT, () => {
  console.log("le serveur est lancé sur le port : " + API_URL);
});