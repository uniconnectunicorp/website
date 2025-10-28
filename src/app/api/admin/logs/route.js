import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'data', 'whatsapp-logs.json');

export async function GET() {
  try {
    // Tenta ler o arquivo de log
    try {
      const logsData = await fs.readFile(logPath, 'utf-8');
      const logs = JSON.parse(logsData);
      return NextResponse.json({ 
        success: true,
        logs: logs || []
      });
    } catch (error) {
      // Se o arquivo não existir, retorna array vazio
      if (error.code === 'ENOENT') {
        return NextResponse.json({ 
          success: true,
          logs: [] 
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao ler logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao processar a requisição' 
      },
      { status: 500 }
    );
  }
}
