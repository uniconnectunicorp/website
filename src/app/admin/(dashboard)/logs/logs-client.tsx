"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Activity, Users, Clock, Database, RefreshCw, X,
} from "lucide-react";

interface Log {
  id: string;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  detail: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface LogsClientProps {
  logs: Log[];
  total: number;
  pages: number;
  currentPage: number;
  stats: {
    total: number;
    today: number;
    week: number;
    byEntity: { entity: string | null; _count: { id: number } }[];
  };
  users: { userId: string | null; userName: string | null; userRole: string | null }[];
  filters: {
    userId: string;
    entity: string;
    action: string;
    dateFrom: string;
    dateTo: string;
    search: string;
  };
}

const ENTITY_LABELS: Record<string, string> = {
  lead: "Lead",
  matricula: "Matrícula",
  usuario: "Usuário",
  finance: "Financeiro",
  auth: "Autenticação",
  config: "Configuração",
  sistema: "Sistema",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  director: "Diretor",
  manager: "Gerente",
  seller: "Vendedor",
  finance: "Financeiro",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  director: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  seller: "bg-green-100 text-green-700",
  finance: "bg-yellow-100 text-yellow-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export function LogsClient({ logs, total, pages, currentPage, stats, users, filters }: LogsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(filters.search);
  const [userId, setUserId] = useState(filters.userId);
  const [entity, setEntity] = useState(filters.entity);
  const [action, setAction] = useState(filters.action);
  const [dateFrom, setDateFrom] = useState(filters.dateFrom);
  const [dateTo, setDateTo] = useState(filters.dateTo);

  const applyFilters = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const f = { search, userId, entity, action, dateFrom, dateTo, page: "1", ...overrides };
    Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const clearFilters = () => {
    setSearch(""); setUserId(""); setEntity(""); setAction(""); setDateFrom(""); setDateTo("");
    startTransition(() => router.push(pathname));
  };

  const goPage = (p: number) => {
    const params = new URLSearchParams();
    const f = { search, userId, entity, action, dateFrom, dateTo };
    Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set("page", String(p));
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const hasFilters = !!(search || userId || entity || action || dateFrom || dateTo);

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Logs do Sistema
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Auditoria completa de todas as ações</p>
        </div>
        <button
          onClick={() => startTransition(() => router.refresh())}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de Logs", value: stats.total.toLocaleString("pt-BR"), icon: Database, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Hoje", value: stats.today.toLocaleString("pt-BR"), icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Últimos 7 dias", value: stats.week.toLocaleString("pt-BR"), icon: Activity, color: "text-green-500", bg: "bg-green-50" },
          { label: "Usuários ativos", value: users.length.toLocaleString("pt-BR"), icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Filtros</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-[12px] text-red-500 hover:text-red-700">
              <X className="h-3 w-3" /> Limpar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Search */}
          <div className="xl:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar em ações, usuários, detalhes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            />
          </div>

          {/* User */}
          <select value={userId} onChange={(e) => { setUserId(e.target.value); applyFilters({ userId: e.target.value }); }} className={inputClass}>
            <option value="">Todos os usuários</option>
            {users.map((u) => (
              <option key={u.userId!} value={u.userId!}>{u.userName || u.userId} ({ROLE_LABELS[u.userRole || ""] || u.userRole})</option>
            ))}
          </select>

          {/* Entity */}
          <select value={entity} onChange={(e) => { setEntity(e.target.value); applyFilters({ entity: e.target.value }); }} className={inputClass}>
            <option value="">Todas as entidades</option>
            {Object.entries(ENTITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            onBlur={() => applyFilters()}
            className={inputClass}
            placeholder="De"
          />

          {/* Date To */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            onBlur={() => applyFilters()}
            className={inputClass}
            placeholder="Até"
          />
        </div>

        <button
          onClick={() => applyFilters()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-[13px] font-medium hover:bg-orange-600"
        >
          <Search className="h-3.5 w-3.5" />
          Buscar
        </button>
      </div>

      {/* By entity breakdown */}
      {stats.byEntity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Atividade por Entidade</p>
          <div className="flex flex-wrap gap-2">
            {stats.byEntity.map((e) => (
              <button
                key={e.entity}
                onClick={() => { const v = e.entity || ""; setEntity(v); applyFilters({ entity: v }); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                <span className="font-medium text-gray-700">{ENTITY_LABELS[e.entity || ""] || e.entity || "—"}</span>
                <span className="text-gray-400 text-[11px]">{e._count.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[13px] text-gray-500">
            <span className="font-semibold text-gray-900">{total.toLocaleString("pt-BR")}</span> registros encontrados
          </p>
          <span className="text-[12px] text-gray-400">Página {currentPage} de {pages || 1}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Data/Hora</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Usuário</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Ação</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Entidade</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Detalhe</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-[13px]">
                    Nenhum log encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-mono text-[12px]">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{log.userName || "—"}</p>
                        {log.userRole && (
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${ROLE_COLORS[log.userRole] || "bg-gray-100 text-gray-600"}`}>
                            {ROLE_LABELS[log.userRole] || log.userRole}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{log.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      {log.entity ? (
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-[11px] font-medium">
                          {ENTITY_LABELS[log.entity] || log.entity}
                          {log.entityId && <span className="text-orange-400 ml-1 font-mono text-[10px]">#{log.entityId.slice(-6)}</span>}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate" title={log.detail || ""}>
                      {log.detail || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {log.ip || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => goPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                const p = currentPage <= 4 ? i + 1 : currentPage - 3 + i;
                if (p < 1 || p > pages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${p === currentPage ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => goPage(currentPage + 1)}
              disabled={currentPage >= pages}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próxima <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
