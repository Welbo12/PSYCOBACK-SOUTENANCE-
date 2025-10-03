
import { createAdmin } from './createAdmin';

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@monapp.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const pseudonyme = process.env.ADMIN_PSEUDONYME || 'admin';

  try {
    const admin = await createAdmin(email, password, pseudonyme);
    if ((admin as any).alreadyExisted) {
      console.log(` Admin déjà existant : ${admin.email_clair}`);
    } else {
      console.log(`Nouvel admin créé : ${admin.email_clair}`);
    }
  } catch (e) {
    console.error('Erreur création admin au démarrage:', e);
  }
}
export default ensureAdmin;