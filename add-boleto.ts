import { config } from 'dotenv'
import pg from 'pg'

config()

async function addBoleto() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL ou DIRECT_URL não encontrada no .env')
    process.exit(1)
  }

  const client = new pg.Client({ connectionString })
  
  try {
    await client.connect()
    console.log('Conectado ao banco de dados...')
    
    // Primeiro, adiciona o valor 'boleto' ao enum PaymentType
    console.log('Adicionando valor "boleto" ao enum PaymentType...')
    await client.query(`ALTER TYPE "PaymentType" ADD VALUE IF NOT EXISTS 'boleto'`)
    console.log('✓ Enum atualizado!')
    
    // Depois, adiciona o método de pagamento
    console.log('Adicionando método de pagamento Boleto...')
    const query = `
      INSERT INTO payment_method (
        id, name, type, "maxInstallments", active, "visibleOnEnrollment",
        "feePercentage", "commissionPercentage", "commissionType",
        "createdAt", "updatedAt"
      ) VALUES (
        'pm_boleto', 'Boleto', 'boleto', NULL, true, true,
        0, 5, 'fixed',
        NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        "feePercentage" = EXCLUDED."feePercentage",
        "commissionPercentage" = EXCLUDED."commissionPercentage",
        "commissionType" = EXCLUDED."commissionType",
        "visibleOnEnrollment" = EXCLUDED."visibleOnEnrollment",
        active = EXCLUDED.active,
        "updatedAt" = NOW()
    `
    
    await client.query(query)
    console.log('✓ Método de pagamento Boleto adicionado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao adicionar Boleto:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

addBoleto()
