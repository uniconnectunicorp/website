"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
  Eye,
  GraduationCap,
  Calendar,
} from "lucide-react";

interface Aluno {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
  course?: string | null;
  city?: string | null;
  state?: string | null;
  createdAt: string;
  finance?: { amount: number } | null;
}

interface AlunosClientProps {
  alunos: Aluno[];
  total: number;
  pages: number;
  currentPage: number;
  initialFilters: {
    search: string;
    course: string;
  };
}

export function AlunosClient({
  alunos,
  total,
  pages,
  currentPage,
  initialFilters,
}: AlunosClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);

  const applyFilters = (page?: number) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.course) params.set("course", filters.course);
    if (page && page > 1) params.set("page", String(page));
    router.push(`/admin/alunos?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, email ou CPF..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="Filtrar por curso..."
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-w-[180px]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Aluno</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Contato</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Curso</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Localidade</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Data Matrícula</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                        <span className="text-orange-600 text-sm font-bold">
                          {aluno.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{aluno.name}</p>
                        {aluno.cpf && <p className="text-xs text-gray-400">{aluno.cpf}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone className="h-3 w-3" /> {aluno.phone}
                      </div>
                      {aluno.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Mail className="h-3 w-3" /> {aluno.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {aluno.course ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg">
                        <GraduationCap className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">{aluno.course}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {[aluno.city, aluno.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(aluno.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/alunos/${aluno.id}`}
                      className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors inline-flex"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {alunos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Nenhum aluno encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Mostrando {(currentPage - 1) * 20 + 1} a {Math.min(currentPage * 20, total)} de {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyFilters(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700 font-medium px-2">
                {currentPage} / {pages}
              </span>
              <button
                onClick={() => applyFilters(currentPage + 1)}
                disabled={currentPage >= pages}
                className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
