// Função para enviar fallback do lead para API externa

const FALLBACK_API_URL = 'https://verbum-bot.bragacoding.com.br/send';
const FALLBACK_API_TOKEN = 'cd91fa8ea7737f4d4cd7affd68db3d4fa01c26c62c9c520acd42ef7990c88b07';

/**
 * Envia dados do lead para API externa como fallback
 * @param {Object} leadData - Dados do lead
 * @param {string} leadData.name - Nome da pessoa
 * @param {string} leadData.sessionId - ID da sessão que gerou o lead
 * @param {string} leadData.responsavel - Responsável pelo lead
 * @param {string} leadData.phone - Telefone do lead
 * @returns {Promise<boolean>} - true se enviado com sucesso, false caso contrário
 */
export async function sendLeadFallback(leadData) {
  try {
    const { 
      name, 
      sessionId, 
      responsavel, 
      leadPhone,
      counterDaSessao,
      counterAtual,
      counterValue,
      numeroResponsavel,
      whatsappNumber,
      tipo,
      sessaoCriadaEm
    } = leadData;
    
    console.log('Iniciando envio de fallback para:', name);
    
    // Formata a data e hora atual no horário de Brasília
    const now = new Date();
    const dateTime = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
    
    // Monta a mensagem com os dados completos do lead
    const tipoLabel = tipo || '📝 FORMULÁRIO';
    const counterSessao = counterDaSessao ?? counterValue ?? 'N/A';
    const counterGlobal = counterAtual ?? 'N/A';
    const message = `🎓 *Novo Lead - Uniconnect*\n\n` +
      `🏷️ *Tipo:* ${tipoLabel}\n` +
      `🆔 *ID Sessão:* ${sessionId || 'N/A'}\n` +
      `👨‍💼 *Responsável:* ${responsavel}\n` +
      `🔢 *Número Seq:* ${numeroResponsavel || 'N/A'} de 3\n` +
      `👤 *Nome:* ${name || 'N/A'}\n` +
      `📱 *Telefone Lead:* ${leadPhone || 'N/A'}\n` +
      `📞 *WhatsApp Destino:* ${whatsappNumber || 'N/A'}\n` +
      `🎯 *Counter da Sessão:* ${counterSessao}\n` +
      `🔄 *Counter Global Atual:* ${counterGlobal}\n` +
      `🕐 *Sessão criada em:* ${sessaoCriadaEm || 'N/A'}\n` +
      `📅 *Data/Hora:* ${dateTime}`;
    
    // Número fixo para receber os fallbacks
    const fallbackNumber = '553171052532';
    
    // Envia para a API externa
    const response = await fetch(FALLBACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FALLBACK_API_TOKEN}`
      },
      body: JSON.stringify({
        message,
        number: fallbackNumber
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao enviar fallback do lead:', response.status, errorText);
      return false;
    }
    
    console.log('Fallback do lead enviado com sucesso:', name);
    return true;
  } catch (error) {
    console.error('Erro ao enviar fallback do lead:', error);
    return false;
  }
}
