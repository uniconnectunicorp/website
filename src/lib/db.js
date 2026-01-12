import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Inicializa o banco de dados se necessário
export async function initDb() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS whatsapp_counter (
        id SERIAL PRIMARY KEY,
        counter INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Insere o contador inicial se não existir
    await query(
      'INSERT INTO whatsapp_counter (id, counter) VALUES (1, 0) ON CONFLICT (id) DO NOTHING'
    );

    await query(`
      CREATE TABLE IF NOT EXISTS whatsapp_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        number TEXT NOT NULL
      );
    `);

    // Tabela para contador de email (alternância de responsáveis)
    await query(`
      CREATE TABLE IF NOT EXISTS email_counter (
        id SERIAL PRIMARY KEY,
        counter INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Insere o contador inicial de email se não existir
    await query(
      'INSERT INTO email_counter (id, counter) VALUES (1, 0) ON CONFLICT (id) DO NOTHING'
    );

    // Tabela para logs de email
    await query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        responsavel TEXT NOT NULL,
        lead_name TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  }
}
