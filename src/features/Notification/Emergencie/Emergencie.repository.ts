
import pool from "../../../shared/database/client";
export async function createEmergency(patientId: string) {
  const result = await pool.query(
    `INSERT INTO emergencies(patient_id, created_at)
     VALUES ($1, NOW())
     RETURNING *`,
    [patientId]
  );
  return result.rows[0];
}
