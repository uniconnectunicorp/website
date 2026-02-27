import 'dotenv/config'
import { Pool } from 'pg'
// Import hashPassword directly from better-auth internal crypto module
import { hashPassword } from 'better-auth/crypto'

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
})

const users = [
  { id: 'user_admin',   name: 'Admin UniConnect',      email: 'admin@uniconnect.com.br',       role: 'admin',    password: 'Admin@2025!' },
  { id: 'user_dir',     name: 'Diretor UniConnect',     email: 'diretor@uniconnect.com.br',     role: 'director', password: 'Admin@2025!' },
  { id: 'user_mgr',     name: 'Gerente UniConnect',     email: 'gerente@uniconnect.com.br',     role: 'manager',  password: 'Admin@2025!' },
  { id: 'user_clara',   name: 'Clara Vendedora',        email: 'clara@uniconnect.com.br',       role: 'seller',   password: 'Admin@2025!' },
  { id: 'user_lidiane', name: 'Lidiane Vendedora',      email: 'lidiane@uniconnect.com.br',     role: 'seller',   password: 'Admin@2025!' },
  { id: 'user_jaiany',  name: 'Jaiany Vendedora',       email: 'jaiany@uniconnect.com.br',      role: 'seller',   password: 'Admin@2025!' },
  { id: 'user_vitoria', name: 'Vitoria Vendedora',      email: 'vitoria@uniconnect.com.br',     role: 'seller',   password: 'Admin@2025!' },
  { id: 'user_fin',     name: 'Financeiro UniConnect',  email: 'financeiro@uniconnect.com.br',  role: 'finance',  password: 'Admin@2025!' },
]

async function main() {
  const client = await pool.connect()
  try {
    console.log('Clearing auth data...')
    await client.query('DELETE FROM "account"')
    await client.query('DELETE FROM "session"')
    await client.query('DELETE FROM "notificacao"')
    await client.query('DELETE FROM "lead_history"')
    await client.query('DELETE FROM "enrollment_link"')
    await client.query('DELETE FROM "matricula"')
    await client.query('DELETE FROM "finance"')
    await client.query('DELETE FROM "lead"')
    await client.query('DELETE FROM "seller_config"')
    await client.query('DELETE FROM "payment_method"')
    await client.query('DELETE FROM "user"')
    console.log('✓ Cleared\n')

    console.log('Creating users with hashed passwords...')
    for (const u of users) {
      const hashed = await hashPassword(u.password)

      // Insert user
      await client.query(
        'INSERT INTO "user" (id, name, email, "emailVerified", role, active, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [u.id, u.name, u.email, true, u.role, true]
      )

      // Insert account (better-auth credential provider)
      await client.query(
        `INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
        [`acc_${u.id}`, u.email, u.id, hashed]
      )

      console.log(`  ✓ ${u.email} (${u.role})`)
    }

    // Seller configs
    console.log('\nCreating seller configs...')
    const sellers = ['user_clara', 'user_lidiane', 'user_jaiany', 'user_vitoria']
    for (const sellerId of sellers) {
      await client.query(
        'INSERT INTO "seller_config" (id, "userId", "minValue", "maxValue") VALUES ($1, $2, $3, $4)',
        [`sc_${sellerId}`, sellerId, 599.90, 1299.90]
      )
    }
    console.log('✓ Seller configs created')

    console.log('\n✅ Users + auth accounts seeded!')
    console.log('   Login: admin@uniconnect.com.br')
    console.log('   Senha: Admin@2025!')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
