import { NextResponse } from 'next/server';
import { getOrCreateLeadSession, isLeadDistributionEnabled } from '@/lib/lead-distribution';

// GET: Obtém ou cria uma sessão de lead
export async function GET(request) {
  try {
    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    const sessionId = request.headers.get('x-lead-session');
    const session = await getOrCreateLeadSession({ sessionId, channel: 'website', source: 'website' });

    if (session) {
      return NextResponse.json({
        success: true,
        sessionId: session.sessionId,
        responsavel: session.responsavel,
        isNew: !sessionId || session.sessionId !== sessionId,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Não foi possível criar ou recuperar a sessão de lead' },
      { status: 500 }
    );
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
    const { sessionId, phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    const session = await getOrCreateLeadSession({
      sessionId,
      phone,
      channel: 'website',
      source: 'website',
    });

    if (session) {
      return NextResponse.json({
        success: true,
        isDuplicate: session.isDuplicate,
        responsavel: session.responsavel,
        sessionId: session.sessionId,
        message: session.isDuplicate ? 'Telefone já cadastrado' : undefined,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Não foi possível atualizar a sessão de lead'
    }, { status: 500 });
  } catch (error) {
    console.error('Erro ao verificar telefone:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
