import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

// Inicializa o banco de dados
await initDb();

export async function GET() {
  try {
    const result = await query('SELECT counter FROM email_counter WHERE id = 1');
    const counter = result.rows[0]?.counter || 0;
    
    return NextResponse.json({ 
      success: true, 
      counter: parseInt(counter, 10)
    });
  } catch (error) {
    console.error('Erro ao obter contador de email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { responsavel, leadName } = await request.json();
    
    // Incrementa o contador e obtém o novo valor
    const counterResult = await query(
      'UPDATE email_counter SET counter = counter + 1 WHERE id = 1 RETURNING counter'
    );
    const newCounter = counterResult.rows[0].counter;
    
    // Adiciona o log
    await query(
      'INSERT INTO email_logs (date, time, responsavel, lead_name) VALUES ($1, $2, $3, $4)',
      [
        new Date().toLocaleDateString('pt-BR'),
        new Date().toLocaleTimeString('pt-BR'),
        responsavel,
        leadName
      ]
    );
    
    // Remove logs antigos (mantém apenas os 1000 mais recentes)
    await query(`
      DELETE FROM email_logs 
      WHERE id NOT IN (
        SELECT id 
        FROM email_logs 
        ORDER BY id DESC 
        LIMIT 1000
      )
    `);
    
    return NextResponse.json({ 
      success: true, 
      counter: newCounter 
    });
  } catch (error) {
    console.error('Erro ao incrementar contador de email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
