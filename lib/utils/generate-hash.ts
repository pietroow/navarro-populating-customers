// Utilitário para gerar hash de senha com bcrypt
// Use a função hashPassword exportada de app/actions/auth.ts para gerar novos hashes
//
// Exemplo de uso em um script Node.js:
// import bcrypt from "bcryptjs"
// const hash = await bcrypt.hash("sua_senha_aqui", 12)
// console.log(hash)
//
// Ou execute: npx tsx -e "import bcrypt from 'bcryptjs'; bcrypt.hash('sua_senha', 12).then(console.log)"

import bcrypt from "bcryptjs"

const SALT_ROUNDS = 12

export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
