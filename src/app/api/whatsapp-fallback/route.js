import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendLeadFallback } from '@/lib/leadFallback';

const responsaveis = ['Clara', 'Lidiane', 'Jaiany'];

export async function POST(request) {
  try {
    const { sessionId, responsavel, number, leadName, leadPhone } = await request.json();
    
    if (!sessionId || !responsavel || !number) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Verifica no banco se esse sessionId já teve fallback enviado
    let jaEnviado = false;
    try {
      const existing = await query(
        "SELECT id FROM whatsapp_logs WHERE number = 'fallback' AND date = $1",
        [sessionId]
      );
      jaEnviado = existing.rows.length > 0;
    } catch (e) {
      console.error('Erro ao verificar fallback duplicado:', e);
    }

    // Busca o counter atual para rastrear a sequência
    let counterValue = 'N/A';
    let expectedResponsavel = 'N/A';
    try {
      const result = await query('SELECT counter FROM lead_counter WHERE id = 1');
      const counter = result.rows[0]?.counter || 0;
      counterValue = counter;
      const expectedIndex = (counter - 1) % responsaveis.length;
      expectedResponsavel = responsaveis[expectedIndex >= 0 ? expectedIndex : 0];
    } catch (e) {
      console.error('Erro ao buscar counter:', e);
    }

    // Determina o número sequencial (1, 2 ou 3) baseado no responsável
    const numeroResponsavel = responsaveis.indexOf(responsavel) + 1;

    // Busca quando a sessão foi criada no banco
    let sessaoCriadaEm = 'N/A';
    try {
      const sessaoResult = await query(
        'SELECT created_at FROM lead_sessions WHERE session_id = $1',
        [sessionId]
      );
      if (sessaoResult.rows.length > 0) {
        sessaoCriadaEm = new Date(sessaoResult.rows[0].created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      }
    } catch (e) {}

    // Determina o tipo de interação
    const temFormulario = leadName && leadName !== 'null';
    const tipo = jaEnviado 
      ? '🔁 CLIQUE REPETIDO' 
      : temFormulario 
        ? '📝 COM FORMULÁRIO' 
        : '👆 APENAS WHATSAPP (sem formulário)';
    
    // Envia fallback para API externa com dados completos
    await sendLeadFallback({
      name: jaEnviado ? `[JÁ ENVIADO] ${leadName || 'Sem nome'}` : (leadName || 'Sem nome (apenas WhatsApp)'),
      sessionId,
      responsavel,
      phone: number,
      leadPhone: leadPhone && leadPhone !== 'null' ? leadPhone : 'N/A',
      counterValue,
      numeroResponsavel,
      expectedResponsavel,
      whatsappNumber: number,
      tipo,
      sessaoCriadaEm
    });

    // Registra no banco que esse sessionId já teve fallback enviado
    if (!jaEnviado) {
      try {
        await query(
          "INSERT INTO whatsapp_logs (date, time, number) VALUES ($1, $2, 'fallback')",
          [
            sessionId,
            new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
          ]
        );
      } catch (e) {
        console.error('Erro ao registrar fallback:', e);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Fallback enviado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao enviar fallback do WhatsApp:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro ao processar fallback'
    }, { status: 200 });
  }
}
