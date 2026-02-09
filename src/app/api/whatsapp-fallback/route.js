import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendLeadFallback } from '@/lib/leadFallback';

const responsaveis = ['Clara', 'Lidiane', 'Jaiany'];

// Cache em memória para rastrear sessões já enviadas no fallback
const sentSessions = new Set();

export async function POST(request) {
  try {
    const { sessionId, responsavel, number, leadName, leadPhone } = await request.json();
    
    if (!sessionId || !responsavel || !number) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Verifica se esse sessionId já foi enviado antes
    const jaEnviado = sentSessions.has(sessionId);

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
      tipo
    });

    // Marca como enviado
    sentSessions.add(sessionId);

    // Limpa cache se ficar muito grande (mantém últimos 5000)
    if (sentSessions.size > 5000) {
      const entries = [...sentSessions];
      entries.slice(0, entries.length - 5000).forEach(id => sentSessions.delete(id));
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
