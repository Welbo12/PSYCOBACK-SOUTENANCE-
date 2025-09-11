import bcrypt from "bcrypt";

export async function hashPassword(motDePasse: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(motDePasse, salt);
}

export async function comparePassword(
  motDePasse: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(motDePasse, hashedPassword);
}


