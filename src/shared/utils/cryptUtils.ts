import bcrypt from "bcrypt";

export async function cryptEmail(email: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(email, salt);
}

export async function compareEmail(
  email: string,
  cryptEmail: string
): Promise<boolean> {
  return await bcrypt.compare(email, cryptEmail);
}

