import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {

    // Obtém os logs do banco de dados
    const result = await query(
      'SELECT id, date, time, number, timestamp FROM whatsapp_logs ORDER BY id DESC LIMIT 1000'
    );
    
    return NextResponse.json({ 
      success: true, 
      logs: result.rows
    });
    
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao processar a requisição',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
