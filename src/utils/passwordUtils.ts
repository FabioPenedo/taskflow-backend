import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Erro ao criar hash da senha');
  }
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Erro ao comparar as senhas');
  }
}