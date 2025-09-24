// import pool from "../config/db";
import pool from "../../../shared/database/client";
import { IDevice } from "./Device.model";

export async function saveDeviceToken(userId: string, token: string): Promise<void> {
  await pool.query(
    `INSERT INTO user_devices (user_id, device_token)
     VALUES ($1, $2)
     ON CONFLICT (user_id, device_token) DO NOTHING`,
    [userId, token]
  );
}

export async function findPsychologistTokens(limit = 10): Promise<string[]> {
  const result = await pool.query(
    `SELECT d.device_token 
     FROM user_devices d
     JOIN utilisateur u ON u.id = d.user_id
     WHERE u.role = 'psychologue'
     LIMIT $1`,
    [limit]
  );
  return result.rows.map((r) => r.device_token);
}
