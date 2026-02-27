import { Pool } from 'pg'
import { config } from 'dotenv'

config()

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
})

// better-auth uses scrypt via @noble/hashes
import { scrypt } from '@noble/hashes/scrypt'
import { randomBytes } from '@noble/hashes/utils'
import { bytesToHex } from '@noble/hashes/utils'

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const saltHex = bytesToHex(salt)
  const key = scrypt(password, salt, { N: 16384, r: 16, p: 1, dkLen: 64 })
  const keyHex = bytesToHex(key)
  return `${saltHex}:${keyHex}`
}

const users = [
  { id: 'user_admin', email: 'admin@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_dir',   email: 'diretor@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_mgr',   email: 'gerente@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_clara', email: 'clara@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_lidiane', email: 'lidiane@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_jaiany', email: 'jaiany@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_vitoria', email: 'vitoria@uniconnect.com.br', password: 'Admin@2025!' },
  { id: 'user_fin',   email: 'financeiro@uniconnect.com.br', password: 'Admin@2025!' },
]

async function seedAuth() {
  const client = await pool.connect()
  try {
    console.log('Seeding auth accounts...')

    // Clear existing accounts
    await client.query('DELETE FROM "account"')

    for (const u of users) {
      const hashed = await hashPassword(u.password)
      await client.query(
        `INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [`acc_${u.id}`, u.email, 'credential', u.id, hashed]
      )
      console.log(`  ✓ ${u.email}`)
    }

    console.log('\n✅ Auth accounts created!')
    console.log('\nLogin credentials:')
    console.log('  Email: admin@uniconnect.com.br')
    console.log('  Senha: Admin@2025!')
  } finally {
    client.release()
    await pool.end()
  }
}

seedAuth().catch(e => { console.error(e); process.exit(1) })
