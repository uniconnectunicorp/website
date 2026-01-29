import { NextResponse } from 'next/server';
import { sendLeadFallback } from '@/lib/leadFallback';

export async function POST(request) {
  try {
    const { sessionId, responsavel, number } = await request.json();
    
    if (!sessionId || !responsavel || !number) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Envia fallback para API externa
    await sendLeadFallback({
      name: 'Botão WhatsApp',
      sessionId,
      responsavel,
      phone: number
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Fallback enviado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao enviar fallback do WhatsApp:', error);
    // Não retorna erro para não quebrar a experiência do usuário
    return NextResponse.json({ 
      success: false,
      error: 'Erro ao processar fallback'
    }, { status: 200 }); // 200 para não quebrar o fluxo
  }
}
