import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Configurar o transporter do nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Template HTML do email
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Matrícula</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f7fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 700px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0b3b75 0%, #1e40af 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 15s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      position: relative;
      z-index: 1;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #ff6600 0%, #ff8800 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 700;
      margin-top: 15px;
      box-shadow: 0 4px 15px rgba(255, 102, 0, 0.3);
    }
    .content {
      padding: 40px 30px;
    }
    .section {
      margin-bottom: 35px;
      background: #f8fafc;
      padding: 25px;
      border-radius: 12px;
      border-left: 4px solid #0b3b75;
    }
    .section-title {
      color: #0b3b75;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .icon {
      width: 24px;
      height: 24px;
      background: #0b3b75;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .info-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .info-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 15px;
      color: #1f2937;
      font-weight: 600;
    }
    .highlight {
      background: linear-gradient(135deg, #0b3b75 0%, #1e40af 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    .highlight-title {
      font-size: 16px;
      margin: 0 0 10px 0;
      opacity: 0.9;
    }
    .highlight-value {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .footer {
      background: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
      color: #6b7280;
      font-size: 14px;
    }
    .footer strong {
      color: #0b3b75;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Nova Matrícula Realizada</h1>
      <div class="badge">
        ✨ Black November - 40% OFF
      </div>
    </div>
    
    <div class="content">
      <div class="highlight">
        <p class="highlight-title">Atendente Responsável</p>
        <p class="highlight-value">${data.seller}</p>
      </div>

      <div class="section">
        <h2 class="section-title">
          <span class="icon">👤</span>
          Dados Pessoais
        </h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Nome Completo</div>
            <div class="info-value">${data.fullName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data de Nascimento</div>
            <div class="info-value">${data.birthDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">CPF</div>
            <div class="info-value">${data.cpf}</div>
          </div>
          <div class="info-item">
            <div class="info-label">RG</div>
            <div class="info-value">${data.rg}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Estado Civil</div>
            <div class="info-value">${data.maritalStatus}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Telefone</div>
            <div class="info-value">${data.phone}</div>
          </div>
          <div class="info-item" style="grid-column: 1 / -1;">
            <div class="info-label">E-mail</div>
            <div class="info-value">${data.email}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">
          <span class="icon">📍</span>
          Endereço
        </h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">CEP</div>
            <div class="info-value">${data.cep}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Estado</div>
            <div class="info-value">${data.state}</div>
          </div>
          <div class="info-item" style="grid-column: 1 / -1;">
            <div class="info-label">Rua</div>
            <div class="info-value">${data.street}, ${data.number}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Bairro</div>
            <div class="info-value">${data.neighborhood}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Cidade</div>
            <div class="info-value">${data.city}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">
          <span class="icon">📚</span>
          Informações do Curso
        </h2>
        <div class="info-grid">
          <div class="info-item" style="grid-column: 1 / -1;">
            <div class="info-label">Curso Escolhido</div>
            <div class="info-value">${data.courseName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Forma de Pagamento</div>
            <div class="info-value">${data.paymentMethod.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Uniconnect - Polo Educacional</strong></p>
      <p>Transformando carreiras através da educação</p>
      <p style="margin-top: 15px; font-size: 12px;">
        Este é um e-mail automático. Por favor, não responda.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Enviar email para o endereço de leads (não para o aluno)
    await transporter.sendMail({
      from: `"Uniconnect - Matrículas" <${process.env.SMTP_USER}>`,
      to: process.env.LEAD_EMAIL || process.env.SMTP_USER,
      subject: `Matricula - ${data.fullName} - ${data.seller}`,
      html: emailHtml,
    });

    return NextResponse.json(
      { message: 'Matrícula realizada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar matrícula:', error);
    return NextResponse.json(
      { message: 'Erro ao processar matrícula. Tente novamente.' },
      { status: 500 }
    );
  }
}
