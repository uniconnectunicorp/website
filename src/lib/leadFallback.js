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
    const { name, sessionId, responsavel, phone } = leadData;
    
    // Formata a data e hora atual
    const now = new Date();
    const dateTime = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Monta a mensagem com os dados do lead
    const message = `🎓 *Novo Lead - Uniconnect*\n\n` +
      `👤 *Nome:* ${name}\n` +
      `🆔 *ID Sessão:* ${sessionId || 'N/A'}\n` +
      `👨‍💼 *Responsável:* ${responsavel}\n` +
      `📅 *Data/Hora:* ${dateTime}`;
    
    // Remove caracteres não numéricos do telefone
    const cleanPhone = phone?.replace(/\D/g, '') || '';
    
    if (!cleanPhone) {
      console.warn('Telefone inválido para fallback:', phone);
      return false;
    }
    
    // Envia para a API externa
    const response = await fetch(FALLBACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FALLBACK_API_TOKEN}`
      },
      body: JSON.stringify({
        message,
        number: cleanPhone
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
