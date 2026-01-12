import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { query, initDb } from '@/lib/db';

// Inicializa o banco de dados
await initDb();

// Array com os responsáveis pelos leads (altere os nomes conforme necessário)
const emailResponsaveis = [
  'Clara',
  'Lidiane',
  'Jaiany'
];

// Função para obter o responsável atual
async function getResponsavelAtual() {
  try {
    const result = await query('SELECT counter FROM email_counter WHERE id = 1');
    const counter = result.rows[0]?.counter || 0;
    const selectedIndex = counter % emailResponsaveis.length;
    return emailResponsaveis[selectedIndex];
  } catch (error) {
    console.error('Erro ao obter responsável:', error);
    return emailResponsaveis[0]; // Fallback para o primeiro
  }
}

// Função para incrementar o contador de email
async function incrementarContadorEmail(responsavel, leadName) {
  try {
    await query(
      'UPDATE email_counter SET counter = counter + 1 WHERE id = 1'
    );
    
    // Adiciona o log
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
    console.error('Erro ao incrementar contador de email:', error);
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
    const { name, email, phone, course, modality, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Obtém o responsável atual pela alternância
    const responsavelAtual = await getResponsavelAtual();

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

    await transporter.sendMail(mailOptions);
    
    // Incrementa o contador após envio bem-sucedido
    await incrementarContadorEmail(responsavelAtual, name);

    return NextResponse.json(
      { 
        message: 'Lead enviado com sucesso!',
        success: true 
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
