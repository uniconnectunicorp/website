import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    pool: pg.Pool | undefined
}

// Usa Transaction Mode (porta 6543) quando disponível, fallback para a URL normal
const connectionString = process.env.CRM_DATABASE_URL || process.env.DIRECT_URL

function getPoolerUrl(url: string): string {
  // Troca porta 5432 (Session Mode) por 6543 (Transaction Mode) se Supabase Pooler
  if (url.includes('pooler.supabase.com:5432')) {
    return url.replace(':5432/', ':6543/')
  }
  return url
}

const poolerUrl = getPoolerUrl(connectionString!)

const pool = globalForPrisma.pool ?? new pg.Pool({
    connectionString: poolerUrl,
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: true,
})

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
    globalForPrisma.pool = pool
}
