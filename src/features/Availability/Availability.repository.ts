import pool from "../../shared/database/client";
import { AvailabilitySlot } from "./Availability.model";

export const AvailabilityRepository = {
  async upsertSlots(providerId: string, slots: Date[]): Promise<number> {
    if (!slots.length) return 0;
    const values: any[] = [];
    const placeholders: string[] = [];
    slots.forEach((d, i) => {
      values.push(providerId, d.toISOString());
      placeholders.push(`($${2 * i + 1}, $${2 * i + 2})`);
    });

    const query = `
      INSERT INTO availability_slots (provider_id, slot_time)
      VALUES ${placeholders.join(", ")}
      ON CONFLICT (provider_id, slot_time) DO NOTHING
    `;
    const res = await pool.query(query, values);
    return res.rowCount || 0;
  },

  async listByProvider(providerId: string): Promise<AvailabilitySlot[]> {
    console.log(`🔍 Repository: Exécution de la requête pour providerId: ${providerId}`);
    const { rows } = await pool.query(
      `SELECT id, provider_id, slot_time, is_booked, created_at
       FROM availability_slots
       WHERE provider_id = $1
       ORDER BY slot_time ASC`,
      [providerId]
    );
    console.log(`📊 Repository: ${rows.length} lignes retournées par la base de données`);
    return rows as AvailabilitySlot[];
  },

  async deleteSlot(providerId: string, slotIso: string): Promise<number> {
    const { rowCount } = await pool.query(
      `DELETE FROM availability_slots WHERE provider_id = $1 AND slot_time = $2 AND is_booked = false`,
      [providerId, slotIso]
    );
    return rowCount || 0;
  },
};


