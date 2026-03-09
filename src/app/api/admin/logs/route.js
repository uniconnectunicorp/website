import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isLeadDistributionEnabled } from '@/lib/lead-distribution';

export async function GET() {
  try {
    if (!isLeadDistributionEnabled()) {
      return NextResponse.json(
        { success: false, error: 'Distribuição de leads v2 não está ativada' },
        { status: 503 }
      );
    }

    const logs = await prisma.leadDistributionEvent.findMany({
      where: {
        eventType: 'whatsapp_click',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1000,
      select: {
        id: true,
        createdAt: true,
        target: true,
        responsavel: true,
        leadName: true,
        phone: true,
      },
    });

    return NextResponse.json({
      success: true,
      logs: logs.map((item) => ({
        id: item.id,
        date: new Date(item.createdAt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        time: new Date(item.createdAt).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        number: item.target,
        timestamp: item.createdAt,
        responsavel: item.responsavel,
        leadName: item.leadName,
        phone: item.phone,
      })),
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
