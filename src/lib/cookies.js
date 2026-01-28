// Funções utilitárias para gerenciar cookies de sessão de lead

export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getLeadSessionId() {
  return getCookie('lead_session_id');
}

export function setLeadSession(sessionId, responsavel) {
  setCookie('lead_session_id', sessionId);
  if (responsavel) {
    setCookie('lead_responsavel', responsavel);
  }
}
