import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const apiSecret = process.env.API_SECRET;
    
    if (!apiSecret) {
      return NextResponse.json(
        { error: 'Burguês Safado!' },
        { status: 500 }
      );
    }
    
    if (!authHeader || authHeader !== `Bearer ${apiSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado - Token de acesso inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone, course, message } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Create transporter (configure with your email provider)
    const transporter = nodemailer.createTransport({
      // Gmail configuration example
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
      },
      // Alternative SMTP configuration
      // host: process.env.SMTP_HOST,
      // port: process.env.SMTP_PORT,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASS,
      // },
    });

    // Email content for the lead notification
    const leadEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0b3b75 0%, #1e5799 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎓 Novo Lead - Polo Educacional Uniconnect</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Coronel Fabriciano - MG</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px;">
          <h2 style="color: #0b3b75; margin-top: 0;">Informações do Lead</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75; width: 30%;">Nome:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Telefone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              ${course ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Curso de Interesse:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${course}</td>
              </tr>
              ` : ''}
              ${message ? `
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #0b3b75; vertical-align: top;">Mensagem:</td>
                <td style="padding: 10px 0;">${message}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #0b3b75;">
            <p style="margin: 0; color: #0b3b75; font-weight: bold;">📞 Ação Recomendada:</p>
            <p style="margin: 5px 0 0 0; color: #666;">Entre em contato com o lead o mais rápido possível para maximizar a conversão.</p>
          </div>
        </div>
        
        <div style="background: #0b3b75; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Lead gerado em ${new Date().toLocaleString('pt-BR')} via site Polo Educacional Uniconnect
          </p>
        </div>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: `"Polo Educacional Uniconnect" <${process.env.EMAIL_USER}>`,
      to: process.env.LEAD_EMAIL || process.env.EMAIL_USER, // Where to send leads
      subject: `🎓 Novo Lead: ${name} - ${course || 'Interesse Geral'}`,
      html: leadEmailContent,
      replyTo: email, // Allow direct reply to the lead
    };

    // Send email
    await transporter.sendMail(mailOptions);
    

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
