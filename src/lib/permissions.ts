export type Role = "admin" | "director" | "manager" | "seller" | "finance";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  director: "Diretor",
  manager: "Gerente",
  seller: "Vendedor",
  finance: "Financeiro",
};

export const MODULE_ACCESS: Record<string, Role[]> = {
  dashboard: ["admin", "director", "finance"],
  crm: ["admin", "director", "manager", "seller"],
  alunos: ["admin", "director", "manager"],
  relatorios: ["admin", "director", "manager", "finance"],
  financeiro: ["admin", "director", "finance"],
  usuarios: ["admin", "director", "manager"],
};

export function canAccess(role: string, module: string): boolean {
  const allowed = MODULE_ACCESS[module];
  if (!allowed) return false;
  return allowed.includes(role as Role);
}

export function canManageUsers(role: string): boolean {
  return ["admin", "director", "manager"].includes(role);
}

export function canSeeAllLeads(role: string): boolean {
  return ["admin", "director", "manager"].includes(role);
}

export function canSeeFinancial(role: string): boolean {
  return ["admin", "director", "finance"].includes(role);
}

export function getDefaultRoute(role: string): string {
  if (role === "seller") return "/admin/crm-pipeline";
  if (role === "finance") return "/admin";
  return "/admin";
}
