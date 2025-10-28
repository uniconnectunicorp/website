import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Ajustando o caminho para garantir que esteja correto
const logPath = path.join(process.cwd(), 'data', 'whatsapp-logs.json')

console.log('Caminho do arquivo de log:', logPath);

export async function GET() {
  console.log('Iniciando requisição GET para /api/admin/logs');
  
  try {
    // Verifica se o diretório existe
    try {
      await fs.access(path.dirname(logPath));
      console.log('Diretório data existe');
    } catch (dirError) {
      console.log('Diretório data não encontrado, criando...');
      await fs.mkdir(path.dirname(logPath), { recursive: true });
    }

    try {
      console.log('Tentando ler o arquivo de log...');
      let logsData = await fs.readFile(logPath, 'utf-8');
      
      // Se o arquivo estiver vazio ou contiver apenas espaços em branco
      if (!logsData.trim()) {
        console.log('Arquivo de log vazio, inicializando com array vazio');
        logsData = '[]';
        await fs.writeFile(logPath, logsData, 'utf-8');
      }
      
      console.log('Conteúdo do arquivo:', logsData);
      
      let logs;
      try {
        logs = JSON.parse(logsData);
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON, recriando arquivo:', parseError);
        logs = [];
        await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');
      }
      
      console.log('Logs processados:', logs.length, 'registros encontrados');
      
      return NextResponse.json({ 
        success: true,
        logs: Array.isArray(logs) ? logs : []
      });
      
    } catch (fileError) {
      console.log('Erro ao ler o arquivo:', fileError);
      
      // Se o arquivo não existir, cria um arquivo vazio
      if (fileError.code === 'ENOENT') {
        console.log('Arquivo de log não encontrado, criando um novo...');
        await fs.writeFile(logPath, JSON.stringify([], null, 2), 'utf-8');
        
        return NextResponse.json({ 
          success: true,
          logs: [] 
        });
      }
      
      throw fileError;
    }
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
