"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Mail,
  Calendar,
  ChevronDown,
  Loader2,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { updateUserRole, deleteUser } from "@/lib/actions/configuracoes";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  createdAt: string;
}

interface ConfiguracoesClientProps {
  users: UserItem[];
}

const roles = [
  { value: "admin", label: "Administrador", color: "bg-red-100 text-red-700", description: "Acesso total ao sistema" },
  { value: "director", label: "Diretor", color: "bg-purple-100 text-purple-700", description: "Visualização completa + relatórios" },
  { value: "manager", label: "Gerente", color: "bg-blue-100 text-blue-700", description: "Gestão de equipe e leads" },
  { value: "seller", label: "Vendedor", color: "bg-green-100 text-green-700", description: "CRM Pipeline e leads atribuídos" },
  { value: "finance", label: "Financeiro", color: "bg-yellow-100 text-yellow-700", description: "Matrículas e pagamentos" },
  { value: "user", label: "Usuário", color: "bg-gray-100 text-gray-700", description: "Sem acesso ao admin" },
];

const roleColors: Record<string, string> = Object.fromEntries(roles.map((r) => [r.value, r.color]));
const roleLabels: Record<string, string> = Object.fromEntries(roles.map((r) => [r.value, r.label]));

const permissionMatrix: Record<string, Record<string, boolean>> = {
  admin:    { dashboard: true, crm: true, matriculas: true, alunos: true, relatorios: true, configuracoes: true },
  director: { dashboard: true, crm: true, matriculas: true, alunos: true, relatorios: true, configuracoes: false },
  manager:  { dashboard: true, crm: true, matriculas: true, alunos: true, relatorios: true, configuracoes: false },
  seller:   { dashboard: true, crm: true, matriculas: false, alunos: false, relatorios: false, configuracoes: false },
  finance:  { dashboard: true, crm: false, matriculas: true, alunos: true, relatorios: true, configuracoes: false },
  user:     { dashboard: false, crm: false, matriculas: false, alunos: false, relatorios: false, configuracoes: false },
};

const pageLabels: Record<string, string> = {
  dashboard: "Visão Geral",
  crm: "CRM Pipeline",
  matriculas: "Matrículas",
  alunos: "Alunos",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
};

export function ConfiguracoesClient({ users }: ConfiguracoesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"usuarios" | "permissoes">("usuarios");

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      await updateUserRole(userId, newRole);
      setEditingUser(null);
      router.refresh();
    });
  };

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      await deleteUser(userId);
      setConfirmDelete(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 inline-flex gap-1">
        <button
          onClick={() => setActiveSection("usuarios")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === "usuarios"
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <User className="h-4 w-4" />
          Usuários
        </button>
        <button
          onClick={() => setActiveSection("permissoes")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === "permissoes"
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Shield className="h-4 w-4" />
          Matriz de Permissões
        </button>
      </div>

      {/* Usuários Section */}
      {activeSection === "usuarios" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Usuários</h3>
            <p className="text-sm text-gray-500 mt-0.5">{users.length} usuários cadastrados</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Usuário</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Cargo</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Cadastro</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user.id ? (
                        <div className="relative">
                          <select
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={isPending}
                            className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          >
                            {roles.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                          {isPending && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                        </div>
                      ) : (
                        <span
                          onClick={() => setEditingUser(user.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            roleColors[user.role] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {roleLabels[user.role] || user.role}
                          <ChevronDown className="h-3 w-3" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {confirmDelete === user.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                          >
                            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirmar"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissões Section */}
      {activeSection === "permissoes" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Matriz de Permissões por Cargo</h3>
            <p className="text-sm text-gray-500 mt-0.5">Visualização de acesso por cargo e página</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Página</th>
                  {roles.map((r) => (
                    <th key={r.value} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Object.keys(pageLabels).map((page) => (
                  <tr key={page} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {pageLabels[page]}
                    </td>
                    {roles.map((r) => (
                      <td key={r.value} className="text-center px-4 py-4">
                        {permissionMatrix[r.value]?.[page] ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100">
                            <Check className="h-4 w-4 text-green-600" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Descriptions */}
          <div className="p-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Descrição dos Cargos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((r) => (
                <div key={r.value} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${r.color}`}>
                    {r.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
