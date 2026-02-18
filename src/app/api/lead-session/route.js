import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

// Array com os responsáveis pelos leads
const responsaveis = [
  'Clara',
  'Lidiane',
  'Jaiany',
  'Vitoria'
];

// Função para obter o próximo responsável e incrementar contador (operação atômica)
async function getProximoResponsavel() {
  try {
    // Operação atômica: incrementa e retorna o valor ANTES do incremento
    const result = await query(
      'UPDATE lead_counter SET counter = counter + 1 WHERE id = 1 RETURNING counter - 1 as previous_counter, counter as new_counter'
    );
    const counter = result.rows[0]?.previous_counter || 0;
    const newCounter = result.rows[0]?.new_counter || 0;
    const selectedIndex = counter % responsaveis.length;
    
    return { responsavel: responsaveis[selectedIndex], counterValue: newCounter };
  } catch (error) {
    console.error('Erro ao obter responsável:', error);
    return { responsavel: responsaveis[0], counterValue: null };
  }
}

// GET: Obtém ou cria uma sessão de lead
export async function GET(request) {
  try {
    await ensureDb();
    const sessionId = request.headers.get('x-lead-session');
    
    // Se já tem sessão, busca o responsável
    if (sessionId) {
      const result = await query(
        'SELECT responsavel FROM lead_sessions WHERE session_id = $1',
        [sessionId]
      );
      
      if (result.rows.length > 0) {
        return NextResponse.json({
          success: true,
          sessionId,
          responsavel: result.rows[0].responsavel,
          isNew: false
        });
      }
    }
    
    // Cria nova sessão
    const newSessionId = uuidv4();
    const { responsavel, counterValue } = await getProximoResponsavel();
    
    await query(
      'INSERT INTO lead_sessions (session_id, responsavel, counter_value) VALUES ($1, $2, $3)',
      [newSessionId, responsavel, counterValue]
    );
    
    return NextResponse.json({
      success: true,
      sessionId: newSessionId,
      responsavel,
      isNew: true
    });
  } catch (error) {
    console.error('Erro ao gerenciar sessão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}

// POST: Verifica telefone duplicado e atualiza sessão
export async function POST(request) {
  try {
    await ensureDb();
    const { sessionId, phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }
    
    // Normaliza o telefone (remove caracteres não numéricos)
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Verifica se o telefone já existe em outra sessão
    const existingPhone = await query(
      'SELECT session_id, responsavel FROM lead_sessions WHERE phone = $1',
      [normalizedPhone]
    );
    
    if (existingPhone.rows.length > 0) {
      // Telefone já existe - retorna que é duplicado
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        responsavel: existingPhone.rows[0].responsavel,
        message: 'Telefone já cadastrado'
      });
    }
    
    // Telefone novo - atualiza a sessão com o telefone
    if (sessionId) {
      await query(
        'UPDATE lead_sessions SET phone = $1 WHERE session_id = $2',
        [normalizedPhone, sessionId]
      );
      
      // Busca o responsável da sessão
      const session = await query(
        'SELECT responsavel FROM lead_sessions WHERE session_id = $1',
        [sessionId]
      );
      
      return NextResponse.json({
        success: true,
        isDuplicate: false,
        responsavel: session.rows[0]?.responsavel || 'Clara'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Sessão não encontrada'
    }, { status: 400 });
  } catch (error) {
    console.error('Erro ao verificar telefone:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
