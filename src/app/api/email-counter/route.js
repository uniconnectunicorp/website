import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isLeadDistributionEnabled, trackLeadEmail } from '@/lib/lead-distribution';

export async function GET() {
  try {
    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    const counter = await prisma.leadDistributionEvent.count({
      where: {
        channel: 'email',
        eventType: 'lead_email_sent',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      counter
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

    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    await trackLeadEmail({
      responsavel,
      leadName,
    });

    const counter = await prisma.leadDistributionEvent.count({
      where: {
        channel: 'email',
        eventType: 'lead_email_sent',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      counter 
    });
  } catch (error) {
    console.error('Erro ao incrementar contador de email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
