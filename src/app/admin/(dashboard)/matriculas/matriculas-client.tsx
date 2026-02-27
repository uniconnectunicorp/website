"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Finance {
  id: string;
  amount: number;
  installments?: number | null;
  paymentMethod?: string | null;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
  course?: string | null;
  courseValue?: number | null;
  finance?: Finance | null;
}

interface Matricula {
  id: string;
  numero: string;
  status: string;
  modalidade: string;
  dataInicio: string;
  dataConclusao?: string | null;
  certificadoEmitido: boolean;
  dataCertificado?: string | null;
  observacoes?: string | null;
  lead: Lead;
}

interface MatriculasClientProps {
  matriculas: Matricula[];
  total: number;
  pages: number;
  currentPage: number;
  stats: {
    totalMatriculas: number;
    ativas: number;
    concluidas: number;
    thisMonth: number;
    totalRevenue: number;
  };
  initialFilters: {
    search: string;
    startDate: string;
    endDate: string;
    course: string;
    status: string;
    modalidade: string;
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ativa:     { label: "Ativa",     color: "bg-green-50 text-green-700 border border-green-200" },
  concluida: { label: "Concluída", color: "bg-blue-50 text-blue-700 border border-blue-200" },
  cancelada: { label: "Cancelada", color: "bg-red-50 text-red-700 border border-red-200" },
  trancada:  { label: "Trancada",  color: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
};

const modalidadeConfig: Record<string, { label: string; color: string }> = {
  regular:        { label: "Regular",        color: "bg-orange-50 text-orange-700 border border-orange-200" },
  aproveitamento: { label: "Aproveitamento", color: "bg-purple-50 text-purple-700 border border-purple-200" },
  competencia:    { label: "Competência",    color: "bg-blue-50 text-blue-700 border border-blue-200" },
};

export function MatriculasClient({
  matriculas,
  total,
  pages,
  currentPage,
  stats,
  initialFilters,
}: MatriculasClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);

  const applyFilters = (newFilters?: typeof filters, page?: number) => {
    const f = newFilters || filters;
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.startDate) params.set("startDate", f.startDate);
    if (f.endDate) params.set("endDate", f.endDate);
    if (f.course) params.set("course", f.course);
    if (f.status) params.set("status", f.status);
    if (f.modalidade) params.set("modalidade", f.modalidade);
    if (page && page > 1) params.set("page", String(page));
    router.push(`/admin/matriculas?${params.toString()}`);
  };

  const handleSelectFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const clearFilters = () => {
    const empty = { search: "", startDate: "", endDate: "", course: "", status: "", modalidade: "" };
    setFilters(empty);
    router.push("/admin/matriculas");
  };

  const hasActiveFilters = filters.search || filters.startDate || filters.endDate || filters.course || filters.status || filters.modalidade;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Gestão de Matrículas</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Gerencie e acompanhe todas as matrículas dos alunos.</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar aluno..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
          />
        </form>

        <select
          value={filters.status}
          onChange={(e) => handleSelectFilter("status", e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
        >
          <option value="">Status</option>
          <option value="ativa">Ativa</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
          <option value="trancada">Trancada</option>
        </select>

        <select
          value={filters.modalidade}
          onChange={(e) => handleSelectFilter("modalidade", e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
        >
          <option value="">Modalidade</option>
          <option value="regular">Regular</option>
          <option value="aproveitamento">Aproveitamento</option>
          <option value="competencia">Competência</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[13px] text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Aluno</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Curso</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Modalidade</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Data Matrícula</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {matriculas.map((m) => {
                const sc = statusConfig[m.status] || { label: m.status, color: "bg-gray-100 text-gray-700" };
                const mc = modalidadeConfig[m.modalidade] || { label: m.modalidade, color: "bg-gray-50 text-gray-600 border border-gray-200" };
                return (
                  <tr
                    key={m.id}
                    onClick={() => router.push(`/admin/matriculas/${encodeURIComponent(m.numero)}`)}
                    className="hover:bg-orange-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-gray-600 text-[12px] font-semibold">{m.lead.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 truncate">{m.lead.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{m.lead.email || m.lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-gray-700 truncate max-w-[160px]">{m.lead.course || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${mc.color}`}>
                        {mc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(m.dataInicio).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900">
                      {m.lead.finance ? formatCurrency(m.lead.finance.amount) : (m.lead.courseValue ? formatCurrency(m.lead.courseValue) : "—")}
                    </td>
                  </tr>
                );
              })}
              {matriculas.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">Nenhuma matrícula encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-[12px] text-gray-500">
            Mostrando {total > 0 ? (currentPage - 1) * 20 + 1 : 0} a {Math.min(currentPage * 20, total)} de {total} matrículas
          </p>
          {pages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyFilters(undefined, currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => applyFilters(undefined, p)}
                  className={`w-7 h-7 rounded-md text-[12px] font-medium transition-colors ${
                    p === currentPage
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => applyFilters(undefined, currentPage + 1)}
                disabled={currentPage >= pages}
                className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
