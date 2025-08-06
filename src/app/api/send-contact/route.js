import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Aqui você pode integrar com seu serviço de email preferido
    // Por exemplo: SendGrid, Nodemailer, etc.
    
    // Simulando envio de email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0b3b75; margin: 0; font-size: 24px;">Nova Mensagem de Contato</h1>
            <div style="width: 50px; height: 3px; background-color: #0b3b75; margin: 10px auto;"></div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0b3b75; margin-top: 0; font-size: 18px;">Informações do Contato</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Nome:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">E-mail:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Telefone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              ${subject ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #0b3b75;">Assunto:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #0b3b75; margin-top: 0; font-size: 16px;">Mensagem:</h3>
            <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Esta mensagem foi enviada através do formulário de contato do site Uniconnect
            </p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
              Data: ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    `;

    // Aqui você implementaria o envio real do email
    // Exemplo com SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'contato@uniconnect.com.br',
      from: 'noreply@uniconnect.com.br',
      subject: `Nova mensagem de contato${subject ? ` - ${subject}` : ''}`,
      html: emailContent,
    };
    
    await sgMail.send(msg);
    */

    // Por enquanto, apenas logamos no console (para desenvolvimento)
    console.log('Nova mensagem de contato recebida:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao processar mensagem de contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
