// Funções utilitárias para gerenciar sessão de lead
// Usa cookie + localStorage como fallback para quando cookies são rejeitados

// ============ COOKIE FUNCTIONS ============
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch (e) {
    console.warn('Erro ao ler cookie:', e);
  }
  return null;
}

function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (e) {
    console.warn('Erro ao definir cookie:', e);
  }
}

// ============ LOCALSTORAGE FUNCTIONS ============
function getLocalStorage(name) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(name);
  } catch (e) {
    console.warn('Erro ao ler localStorage:', e);
    return null;
  }
}

function setLocalStorage(name, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(name, value);
  } catch (e) {
    console.warn('Erro ao definir localStorage:', e);
  }
}

// ============ UNIFIED STORAGE (Cookie + LocalStorage) ============
function getValue(name) {
  // Tenta cookie primeiro, depois localStorage
  return getCookie(name) || getLocalStorage(name);
}

function setValue(name, value, days = 30) {
  // Salva em ambos para garantir persistência
  setCookie(name, value, days);
  setLocalStorage(name, value);
}

// ============ LEAD SESSION EXPORTS ============
export function getLeadSessionId() {
  return getValue('lead_session_id');
}

export function getLeadResponsavel() {
  return getValue('lead_responsavel');
}

export function setLeadSession(sessionId, responsavel) {
  if (sessionId) {
    setValue('lead_session_id', sessionId);
  }
  if (responsavel) {
    setValue('lead_responsavel', responsavel);
  }
}
