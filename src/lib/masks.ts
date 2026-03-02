export function maskPhone(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{4})\d+?$/, "$1");
}

export function maskCPF(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
}

export function maskRG(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{1})\d+?$/, "$1");
}

export function maskCEP(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");
}

export function maskDate(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{4})\d+?$/, "$1");
}

/** Converte "YYYY-MM-DD" ou ISO string para "DD/MM/YYYY" para exibição */
export function isoToBR(v?: string | null): string {
  if (!v) return "";
  const d = v.includes("T") ? v.slice(0, 10) : v;
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return v;
  return `${day}/${m}/${y}`;
}

/** Converte "DD/MM/YYYY" para "YYYY-MM-DD" para salvar */
export function brToISO(v: string): string {
  const [day, m, y] = v.split("/");
  if (!y || !m || !day) return v;
  return `${y}-${m}-${day}`;
}
