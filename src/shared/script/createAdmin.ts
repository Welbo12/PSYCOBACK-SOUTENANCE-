import pool from "../database/client";
import { hashPassword } from "../utils/hashUtils";

export interface CreatedAdmin {
  id: string;
  pseudonyme: string;
  email_clair: string | null;
  role: string;
}

/**
 * Crée un compte administrateur en base de données.
 * - Insère dans `utilisateur` avec role = 'admin'
 * - Insère la ligne correspondante dans `administrateur`
 */
export async function createAdmin(
  email: string,
  password: string,
  pseudonyme = "admin"
): Promise<CreatedAdmin> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // 2) Insérer l'utilisateur admin
    const insertUserSql = `
      INSERT INTO utilisateur (pseudonyme, motdepasse, email_clair, role)
      VALUES ($1, $2, $3, 'admin')
      RETURNING id, pseudonyme, email_clair, role;
    `;
    const userRes = await client.query(insertUserSql, [pseudonyme, hashedPassword, email]);
    const adminUser = userRes.rows[0] as CreatedAdmin;

    // 3) Insérer dans la table administrateur
    await client.query(`INSERT INTO administrateur (id) VALUES ($1)`, [adminUser.id]);

    await client.query("COMMIT");
    return adminUser;
  } catch (err) {
    await client.query("ROLLBACK");
    // Relayer l'erreur pour gestion en amont
    throw err;
  } finally {
    client.release();
  }
}

// Exécution directe (script): utiliser variables d'environnement
// ADMIN_EMAIL et ADMIN_PASSWORD, optionnel ADMIN_PSEUDONYME
if (require.main === module) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const pseudonyme = process.env.ADMIN_PSEUDONYME || "admin";

  if (!email || !password) {
    console.error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis");
    process.exit(1);
  }

  createAdmin(email, password, pseudonyme)
    .then((admin) => {
      console.log("Administrateur créé:", admin);
      process.exit(0);
    })
    .catch((e) => {
      console.error("Erreur création admin:", e);
      process.exit(1);
    });
}


