import { promises as fs } from 'fs';
import path from 'path';

const counterPath = path.join(process.cwd(), 'data', 'counter.json');
const logPath = path.join(process.cwd(), 'data', 'whatsapp-logs.json');

async function getCounter() {
  try {
    const data = await fs.readFile(counterPath, 'utf-8');
    return JSON.parse(data).counter;
  } catch (error) {
    // Se o arquivo não existir, retorna 0
    return 0;
  }
}

async function logWhatsAppNumber(number) {
  try {
    const now = new Date();
    const logEntry = {
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR'),
      number: number
    };

    let logs = [];
    
    // Tenta ler os logs existentes
    try {
      const logsData = await fs.readFile(logPath, 'utf-8');
      logs = JSON.parse(logsData);
    } catch (error) {
      // Se o arquivo não existir, começa com array vazio
    }

    // Adiciona o novo log e mantém apenas os últimos 1000 registros
    logs.push(logEntry);
    const recentLogs = logs.slice(-1000);

    // Garante que o diretório existe
    await fs.mkdir(path.dirname(logPath), { recursive: true });
    
    // Salva os logs atualizados
    await fs.writeFile(
      logPath,
      JSON.stringify(recentLogs, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Erro ao registrar log do WhatsApp:', error);
  }
}

async function incrementCounter() {
  const currentCounter = await getCounter();
  const newCounter = currentCounter + 1;
  
  // Garante que o diretório existe
  await fs.mkdir(path.dirname(counterPath), { recursive: true });
  
  // Salva o novo valor
  await fs.writeFile(
    counterPath,
    JSON.stringify({ counter: newCounter }, null, 2),
    'utf-8'
  );
  
  return newCounter;
}

export async function GET() {
  try {
    const currentCounter = await getCounter();
    // Retorna apenas o contador atual
    return Response.json({ 
      success: true, 
      counter: currentCounter 
    });
  } catch (error) {
    console.error('Error in GET /api/whatsapp-counter:', error);
    return Response.json(
      { success: false, error: 'Failed to get counter' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { number } = await request.json();
    const newCounter = await incrementCounter();
    
    // Registra qual número foi utilizado
    if (number) {
      await logWhatsAppNumber(number);
    }
    
    return Response.json({ 
      success: true, 
      counter: newCounter 
    });
  } catch (error) {
    console.error('Error in POST /api/whatsapp-counter:', error);
    return Response.json(
      { success: false, error: 'Failed to increment counter' },
      { status: 500 }
    );
  }
}