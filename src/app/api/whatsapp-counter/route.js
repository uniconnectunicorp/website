import { NextResponse } from 'next/server';
import { isLeadDistributionEnabled, trackWhatsappClick } from '@/lib/lead-distribution';

export async function GET() {
  try {
    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      counter: null
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
    const { number, sessionId, responsavel, leadName, leadPhone } = await request.json();

    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    await trackWhatsappClick({
      sessionId,
      responsavel,
      number,
      leadName,
      leadPhone,
    });
    
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