import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

// Inicializa o banco de dados
await initDb();

export async function GET() {
  try {
    const result = await query('SELECT counter FROM lead_counter WHERE id = 1');
    const counter = result.rows[0]?.counter || 0;
    
    return NextResponse.json({ 
      success: true, 
      counter: parseInt(counter, 10)
    });
  } catch (error) {
    console.error('Erro ao obter contador:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { number } = await request.json();
    
    // Apenas registra o log do clique no WhatsApp
    // NÃO incrementa o lead_counter aqui - isso já é feito na lead-session
    await query(
      'INSERT INTO whatsapp_logs (date, time, number) VALUES ($1, $2, $3)',
      [
        new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        number
      ]
    );
    
    // Remove logs antigos (mantém apenas os 1000 mais recentes)
    await query(`
      DELETE FROM whatsapp_logs 
      WHERE id NOT IN (
        SELECT id 
        FROM whatsapp_logs 
        ORDER BY id DESC 
        LIMIT 1000
      )
    `);
    
    return NextResponse.json({ 
      success: true
    });
  } catch (error) {
    console.error('Erro ao registrar log do WhatsApp:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}