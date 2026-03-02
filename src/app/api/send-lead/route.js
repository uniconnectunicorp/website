import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { query, initDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { sendLeadFallback } from '@/lib/leadFallback';
import { prisma } from '@/lib/prisma';

// Map seller names to Prisma user IDs (will try to find by name)
async function findOrAssignSeller(responsavel) {
  try {
    const seller = await prisma.user.findFirst({
      where: {
        name: { contains: responsavel, mode: 'insensitive' },
        role: { in: ['seller', 'admin', 'manager', 'director'] },
        active: true,
      },
      select: { id: true },
    });
    return seller?.id || null;
  } catch (error) {
    console.error('findOrAssignSeller error:', error);
    return null;
  }
}

// Save lead to Prisma for CRM
async function saveToPrisma({ name, email, phone, course, modality, message, sessionId, responsavel }) {
  try {
    const normalizedPhone = phone?.replace(/\D/g, '') || '';

    // Check if lead already exists by phone
    const existing = await prisma.lead.findFirst({
      where: { phone: { contains: normalizedPhone } },
    });

    if (existing) {
      // Update existing lead with new data if missing
      const updates = {};
      if (!existing.email && email) updates.email = email;
      if (!existing.course && course) updates.course = course;
      if (!existing.message && message) updates.message = message;
      if (Object.keys(updates).length > 0) {
        await prisma.lead.update({ where: { id: existing.id }, data: updates });
      }
      return existing.id;
    }

    // Find seller ID
    const sellerId = await findOrAssignSeller(responsavel);

    // Map modality string to enum
    let modalidade = null;
    if (modality) {
      const mod = modality.toLowerCase();
      if (mod.includes('aproveitamento')) modalidade = 'aproveitamento';
      else if (mod.includes('competencia') || mod.includes('competência')) modalidade = 'competencia';
      else if (mod.includes('regular')) modalidade = 'regular';
    }

    const lead = await prisma.lead.create({
      data: {
        id: uuidv4(),
        name,
        email: email || null,
        phone,
        course: course || null,
        modalidade,
        message: message || null,
        source: 'website',
        sessionId: sessionId || null,
        assignedTo: sellerId,
        status: 'pending',
      },
    });

    // Create history entry
    await prisma.leadHistory.create({
      data: {
        id: uuidv4(),
        leadId: lead.id,
        action: `Lead criado via site - Responsável: ${responsavel}`,
        toStatus: 'pending',
        userId: sellerId,
      },
    });

    return lead.id;
  } catch (error) {
    console.error('saveToPrisma error:', error);
    return null;
  }
}

let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

// Cache de vendedores (atualizado a cada 5 minutos)
let sellersCache = null;
let sellersCacheTime = 0;
const SELLERS_CACHE_TTL = 5 * 60 * 1000; // 5 min

async function getSellersForRoundRobin() {
  const now = Date.now();
  if (sellersCache && now - sellersCacheTime < SELLERS_CACHE_TTL) {
    return sellersCache;
  }
  try {
    const sellers = await prisma.user.findMany({
      where: {
        role: { in: ['seller', 'admin', 'director', 'manager'] },
        active: true,
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    if (sellers.length > 0) {
      sellersCache = sellers;
      sellersCacheTime = now;
      return sellers;
    }
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
  }
  // Fallback: retorna lista vazia — getProximoResponsavel trata isso
  return sellersCache || [];
}

// Função para obter o próximo responsável e incrementar contador (operação atômica)
async function getProximoResponsavel() {
  try {
    const sellers = await getSellersForRoundRobin();
    if (sellers.length === 0) {
      return { responsavel: 'Equipe', counterValue: null };
    }
    // Operação atômica: incrementa e retorna o valor ANTES do incremento
    const result = await query(
      'UPDATE lead_counter SET counter = counter + 1 WHERE id = 1 RETURNING counter - 1 as previous_counter, counter as new_counter'
    );
    const counter = result.rows[0]?.previous_counter || 0;
    const newCounter = result.rows[0]?.new_counter || 0;
    const selectedIndex = counter % sellers.length;
    
    return { responsavel: sellers[selectedIndex].name, sellerId: sellers[selectedIndex].id, counterValue: newCounter };
  } catch (error) {
    console.error('Erro ao obter responsável:', error);
    const sellers = await getSellersForRoundRobin();
    return { responsavel: sellers[0]?.name || 'Equipe', sellerId: sellers[0]?.id || null, counterValue: null };
  }
}

// Função para verificar/criar sessão e obter responsável
async function getResponsavelPorSessao(sessionId, phone) {
  const normalizedPhone = phone?.replace(/\D/g, '');
  
  // 1. Verifica se o telefone já existe no banco
  if (normalizedPhone) {
    const existingPhone = await query(
      'SELECT responsavel FROM lead_sessions WHERE phone = $1',
      [normalizedPhone]
    );
    
    if (existingPhone.rows.length > 0) {
      // Telefone duplicado - retorna o responsável mas marca como duplicado
      return {
        responsavel: existingPhone.rows[0].responsavel,
        isDuplicate: true
      };
    }
  }
  
  // 2. Verifica se tem sessão existente
  if (sessionId) {
    const existingSession = await query(
      'SELECT responsavel FROM lead_sessions WHERE session_id = $1',
      [sessionId]
    );
    
    if (existingSession.rows.length > 0) {
      // Atualiza o telefone na sessão se ainda não tiver
      if (normalizedPhone) {
        await query(
          'UPDATE lead_sessions SET phone = $1 WHERE session_id = $2 AND phone IS NULL',
          [normalizedPhone, sessionId]
        );
      }
      
      return {
        responsavel: existingSession.rows[0].responsavel,
        isDuplicate: false
      };
    }
  }
  
  // 3. Sessão não encontrada — tenta encontrar sessão órfã recente (cookie perdido)
  //    antes de criar uma nova e incrementar o counter novamente.
  let responsavel;
  let counterValue;
  
  // Busca sessão recente sem telefone (criada pelo lead-session nos últimos 30min)
  // que provavelmente pertence a este visitante cujo cookie se perdeu
  try {
    const orphanSession = await query(
      `SELECT session_id, responsavel, counter_value FROM lead_sessions 
       WHERE phone IS NULL AND created_at > NOW() - INTERVAL '30 minutes'
       ORDER BY created_at DESC LIMIT 1`
    );
    
    if (orphanSession.rows.length > 0) {
      // Reutiliza a sessão órfã em vez de incrementar o counter
      const orphan = orphanSession.rows[0];
      if (normalizedPhone) {
        await query(
          'UPDATE lead_sessions SET phone = $1 WHERE session_id = $2',
          [normalizedPhone, orphan.session_id]
        );
      }
      return {
        responsavel: orphan.responsavel,
        isDuplicate: false,
        newSessionId: orphan.session_id
      };
    }
  } catch (error) {
    console.error('Erro ao buscar sessão órfã:', error);
  }
  
  // Nenhuma sessão órfã encontrada — cria nova sessão com incremento normal
  const { responsavel: newResponsavel, counterValue: newCounterValue } = await getProximoResponsavel();
  responsavel = newResponsavel;
  counterValue = newCounterValue;

  const newSessionId = sessionId || uuidv4();
  
  await query(
    'INSERT INTO lead_sessions (session_id, phone, responsavel, counter_value) VALUES ($1, $2, $3, $4) ON CONFLICT (session_id) DO NOTHING',
    [newSessionId, normalizedPhone, responsavel, counterValue]
  );
  
  return {
    responsavel,
    isDuplicate: false,
    newSessionId
  };
}

// Função para registrar log de email
async function registrarLogEmail(responsavel, leadName) {
  try {
    await query(
      'INSERT INTO email_logs (date, time, responsavel, lead_name) VALUES ($1, $2, $3, $4)',
      [
        new Date().toLocaleDateString('pt-BR'),
        new Date().toLocaleTimeString('pt-BR'),
        responsavel,
        leadName
      ]
    );
  } catch (error) {
    console.error('Erro ao registrar log de email:', error);
  }
}

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; 
const MAX_REQUESTS = 3; 

function getRateLimitKey(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip;
}

function isRateLimited(key) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(key) || [];
  
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  rateLimitMap.set(key, recentRequests);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  
  return false;
}

export async function POST(request) {
  try {
    await ensureDb();
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Vai derrubar o site da sua vó! feat: Rate Limiting' },
        { status: 429 }
      );
    }

    const secretKey = process.env.API_SECRET;
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    ];
    
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Configuração do servidor inválida' },
        { status: 500 }
      );
    }
    
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    const isValidOrigin = origin && allowedOrigins.some(allowed => 
      origin.startsWith(allowed)
    );
    const isValidReferer = referer && allowedOrigins.some(allowed => 
      referer.startsWith(allowed)
    );
    
    if (!isValidOrigin && !isValidReferer) {
      return NextResponse.json(
        { error: 'Burguês Safado! Deus ta vendo...' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, course, modality, message, sessionId } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Obtém o responsável baseado na sessão/telefone
    const { responsavel: responsavelAtual, isDuplicate, newSessionId } = await getResponsavelPorSessao(sessionId, phone);
    
    // Se for telefone duplicado, retorna sucesso mas não envia email
    if (isDuplicate) {
      console.log(`Lead duplicado ignorado: ${name} - ${phone}`);
      
      // Envia fallback mesmo para duplicados (para registro)
      try {
        const counterResult = await query('SELECT counter FROM lead_counter WHERE id = 1');
        const counterVal = counterResult.rows[0]?.counter || 0;
        const allSellers = await getSellersForRoundRobin();
        const numResp = allSellers.findIndex(s => s.name === responsavelAtual) + 1;

        await sendLeadFallback({
          name: `[DUPLICADO] ${name}`,
          sessionId: sessionId,
          responsavel: responsavelAtual,
          phone,
          leadPhone: phone,
          counterValue: counterVal,
          numeroResponsavel: numResp,
          expectedResponsavel: allSellers[(counterVal - 1) % Math.max(allSellers.length, 1)]?.name || responsavelAtual,
          whatsappNumber: 'N/A (formulário)'
        });
      } catch (err) {
        console.error('Erro no fallback duplicado:', err);
      }
      
      return NextResponse.json(
        { 
          message: 'Lead enviado com sucesso!',
          success: true,
          sessionId: sessionId
        },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },

    });

    const leadEmailContent = message ? 
    `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0b3b75 0%, #1e5799 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎓 Novo Lead - Polo Educacional Uniconnect</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Coronel Fabriciano - MG</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px;">
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-weight: bold;">👤 Responsável por este lead: ${responsavelAtual}</p>
          </div>
          <h2 style="color: #0b3b75; margin-top: 0;">Informações do Lead</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75; width: 30%;">Nome:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              ${email ? 
                `<tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
              </tr>`
              : ''
              }
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Telefone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Mensagem:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${message}</td>
              </tr>
              ` : ''}             
            </table>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #0b3b75;">
            <p style="margin: 0; color: #0b3b75; font-weight: bold;">📞 Ação Recomendada:</p>
            <p style="margin: 5px 0 10px 0; color: #666;">Entre em contato com o lead o mais rápido possível para maximizar a conversão.</p>
            
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://wa.me/55${phone.replace(/\D/g, '')}?text=👋%20Olá%20${encodeURIComponent(name)}!%20😊%0A%0A📚%20Vi%20que%20você%20demonstrou%20interesse%20${course ? `no%20curso%20de%20${encodeURIComponent(course)}` : 'em%20nossos%20cursos'}%20através%20do%20nosso%20site.%0A%0A🎓%20Gostaria%20de%20conversar%20com%20você%20sobre%20as%20oportunidades%20educacionais%20que%20temos%20disponíveis.%0A%0A⏰%20Quando%20seria%20um%20bom%20momento%20para%20conversarmos?" 
                 style="background: #25D366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">
                💬 Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div style="background: #0b3b75; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Lead gerado em ${new Date().toLocaleString('pt-BR')} via site Polo Educacional Uniconnect
          </p>
        </div>
      </div>
    `
    :
     `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0b3b75 0%, #1e5799 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎓 Novo Lead - Polo Educacional Uniconnect</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Coronel Fabriciano - MG</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px;">
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-weight: bold;">👤 Responsável por este lead: ${responsavelAtual}</p>
          </div>
          <h2 style="color: #0b3b75; margin-top: 0;">Informações do Lead</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75; width: 30%;">Nome:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
             ${email ?
              `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
            </tr>` 
            : ''
             }
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Telefone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              ${modality ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Modalidade:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${modality}</td>
              </tr>
              ` : ''}
              ${course ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Curso de Interesse:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${course}</td>
              </tr>
              ` : ''}
             
            </table>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #0b3b75;">
            <p style="margin: 0; color: #0b3b75; font-weight: bold;">📞 Ação Recomendada:</p>
            <p style="margin: 5px 0 10px 0; color: #666;">Entre em contato com o lead o mais rápido possível para maximizar a conversão.</p>
            
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://wa.me/55${phone.replace(/\D/g, '')}?text=👋%20Olá%20${encodeURIComponent(name)}!%20😊%0A%0A📚%20Vi%20que%20você%20demonstrou%20interesse%20${course ? `no%20curso%20de%20${encodeURIComponent(course)}` : 'em%20nossos%20cursos'}%20através%20do%20nosso%20site.%0A%0A🎓%20Gostaria%20de%20conversar%20com%20você%20sobre%20as%20oportunidades%20educacionais%20que%20temos%20disponíveis.%0A%0A⏰%20Quando%20seria%20um%20bom%20momento%20para%20conversarmos?" 
                 style="background: #25D366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">
                💬 Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div style="background: #0b3b75; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Lead gerado em ${new Date().toLocaleString('pt-BR')} via site Polo Educacional Uniconnect
          </p>
        </div>
      </div>
    `

    const mailOptions = {
      from: `"Polo Educacional Uniconnect" <${process.env.EMAIL_USER}>`,
      to: process.env.LEAD_EMAIL || process.env.EMAIL_USER, 
      subject: message ? `[${responsavelAtual}] Mensagem do site: ${name}` : `[${responsavelAtual}] 🎓 Novo Lead: ${name} - ${course || 'Interesse Geral'}`,
      html: leadEmailContent,
      replyTo: email,
    };

    // Envia email (não-bloqueante — CRM e fallback executam mesmo se falhar)
    try {
      await transporter.sendMail(mailOptions);
      await registrarLogEmail(responsavelAtual, name);
    } catch (emailErr) {
      console.error('Erro ao enviar email (não crítico):', emailErr);
    }

    // Save to Prisma CRM (non-blocking, doesn't affect response)
    try {
      await saveToPrisma({
        name, email, phone, course, modality, message,
        sessionId: newSessionId || sessionId,
        responsavel: responsavelAtual,
      });
    } catch (err) {
      console.error('Erro ao salvar no Prisma CRM (não crítico):', err);
    }

    // Envia fallback para API externa com dados completos
    try {
      const counterResult = await query('SELECT counter FROM lead_counter WHERE id = 1');
      const counterVal = counterResult.rows[0]?.counter || 0;
      const allSellers = await getSellersForRoundRobin();
      const numResp = allSellers.findIndex(s => s.name === responsavelAtual) + 1;

      await sendLeadFallback({
        name,
        sessionId: newSessionId || sessionId,
        responsavel: responsavelAtual,
        phone,
        leadPhone: phone,
        counterValue: counterVal,
        numeroResponsavel: numResp,
        expectedResponsavel: allSellers[(counterVal - 1) % Math.max(allSellers.length, 1)]?.name || responsavelAtual,
        whatsappNumber: 'N/A (formulário)'
      });
    } catch (err) {
      console.error('Erro no fallback (não crítico):', err);
    }

    return NextResponse.json(
      { 
        message: 'Lead enviado com sucesso!',
        success: true,
        sessionId: newSessionId || sessionId,
        responsavel: responsavelAtual
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor ao enviar email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
