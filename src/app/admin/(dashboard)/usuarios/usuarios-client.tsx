"use client";

import { useState, useTransition } from "react";
import {
  Search, Loader2, Settings, Plus, Pencil, Trash2, KeyRound, Eye, EyeOff,
} from "lucide-react";
import { updateUserRole, toggleUserActive, updateSellerConfig, updateSellerValueLimits, saveUserPermissions, updateUserData, deleteUser, changeUserPassword, createUser } from "@/lib/actions/usuarios";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  director: "Diretor",
  manager: "Gerente",
  seller: "Vendedor",
  finance: "Financeiro",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-50 text-red-700 border border-red-200",
  director: "bg-purple-50 text-purple-700 border border-purple-200",
  manager: "bg-blue-50 text-blue-700 border border-blue-200",
  seller: "bg-orange-50 text-orange-700 border border-orange-200",
  finance: "bg-green-50 text-green-700 border border-green-200",
};

// Permission modules matching Figma toggles
const PERMISSION_MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "crm", label: "CRM" },
  { key: "relatorios", label: "Relatórios" },
  { key: "financeiro", label: "Financeiro" },
  { key: "matriculas", label: "Matrículas" },
];

// Default permissions per role
const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
  admin:    { dashboard: true, crm: true, relatorios: true, financeiro: true, matriculas: true },
  director: { dashboard: true, crm: true, relatorios: true, financeiro: true, matriculas: true },
  manager:  { dashboard: false, crm: true, relatorios: true, financeiro: false, matriculas: true },
  seller:   { dashboard: false, crm: true, relatorios: false, financeiro: false, matriculas: false },
  finance:  { dashboard: true, crm: false, relatorios: true, financeiro: true, matriculas: false },
};

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  image?: string | null;
  permissions?: Record<string, boolean> | null;
  createdAt: string;
  sellerConfig: { minValue: number; maxValue: number; valueLimits: any } | null;
  leadsCount: number;
  linksCount: number;
}

interface UsuariosClientProps {
  users: UserData[];
  currentUserId: string;
  currentUserRole: string;
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-orange-500" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out mt-0.5 ${
          enabled ? "translate-x-4 ml-0.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function UsuariosClient({ users: initialUsers, currentUserId, currentUserRole }: UsuariosClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", newPassword: "" });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<UserData | null>(null);
  const [actionError, setActionError] = useState("");
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role: "seller" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newUserError, setNewUserError] = useState("");
  const [newUserSuccess, setNewUserSuccess] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, { min: string }>>({
    regular:        { min: "0" },
    aproveitamento: { min: "0" },
    competencia:    { min: "0" },
    sequencial:     { min: "0" },
    eja:            { min: "0" },
    ingles:         { min: "0" },
  });
  const [formError, setFormError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local permissions state (derived from roles, editable in UI)
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const perms: Record<string, Record<string, boolean>> = {};
    initialUsers.forEach((u) => {
      if (u.permissions && Object.keys(u.permissions).length > 0) {
        perms[u.id] = { ...(DEFAULT_PERMISSIONS[u.role] || DEFAULT_PERMISSIONS.seller), ...u.permissions };
      } else {
        perms[u.id] = { ...(DEFAULT_PERMISSIONS[u.role] || DEFAULT_PERMISSIONS.seller) };
      }
    });
    return perms;
  });

  const canManage = ["admin", "director"].includes(currentUserRole);
  const canChangeRoles = currentUserRole === "admin";
  const isCurrentUserAdmin = currentUserRole === "admin";

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    return u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!canChangeRoles || userId === currentUserId) return;
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        setPermissions((prev) => ({ ...prev, [userId]: { ...(DEFAULT_PERMISSIONS[newRole] || DEFAULT_PERMISSIONS.seller) } }));
      }
    });
  };

  const handleToggleActive = (userId: string, currentActive: boolean) => {
    if (!canManage || userId === currentUserId) return;
    startTransition(async () => {
      const result = await toggleUserActive(userId, !currentActive);
      if (result.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: !currentActive } : u));
      }
    });
  };

  const togglePermission = (userId: string, module: string) => {
    setSaveSuccess(false);
    setPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [module]: !prev[userId]?.[module],
      },
    }));
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditForm({ name: user.name || "", email: user.email || "", newPassword: "" });
    setShowEditPassword(false);
    setActionError("");
  };

  const handleSaveEdit = () => {
    if (!editingUser || !editForm.name.trim() || !editForm.email.trim()) {
      setActionError("Nome e e-mail são obrigatórios.");
      return;
    }
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      setActionError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setActionError("");
    startTransition(async () => {
      const result = await updateUserData(editingUser.id, { name: editForm.name.trim(), email: editForm.email.trim() });
      if (!result.success) { setActionError(result.error || "Erro ao salvar."); return; }
      if (editForm.newPassword.trim()) {
        const pwResult = await changeUserPassword(editingUser.id, editForm.newPassword);
        if (!pwResult.success) { setActionError(pwResult.error || "Erro ao trocar senha."); return; }
      }
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, name: editForm.name.trim(), email: editForm.email.trim() } : u));
      setEditingUser(null);
    });
  };

  const handleCreateUser = () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      setNewUserError("Nome, e-mail e senha são obrigatórios.");
      return;
    }
    if (newUserForm.password.length < 6) {
      setNewUserError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setNewUserError("");
    startTransition(async () => {
      const result = await createUser(newUserForm);
      if (result.success) {
        setNewUserSuccess(true);
        setTimeout(() => {
          setShowNewUserModal(false);
          setNewUserForm({ name: "", email: "", password: "", role: "seller" });
          setNewUserSuccess(false);
          window.location.reload();
        }, 1200);
      } else {
        setNewUserError(result.error || "Erro ao criar usuário.");
      }
    });
  };

  const handleDeleteUser = () => {
    if (!deleteConfirm) return;
    startTransition(async () => {
      const result = await deleteUser(deleteConfirm.id);
      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } else {
        setActionError(result.error || "Erro ao apagar.");
      }
    });
  };

  const handleSavePermissions = () => {
    startTransition(async () => {
      const result = await saveUserPermissions(permissions);
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  const CATEGORIES = [
    { key: "regular",       label: "Regular",       refPrice: 999.90 },
    { key: "aproveitamento",label: "Aproveitamento", refPrice: 1199.90 },
    { key: "competencia",   label: "Competência",    refPrice: 1199.90 },
    { key: "sequencial",    label: "Sequencial",     refPrice: 1109.90 },
    { key: "eja",           label: "EJA",            refPrice: 999.90 },
    { key: "ingles",        label: "Inglês",         refPrice: 398.90 },
  ];

  const handleSaveConfig = (userId: string) => {
    const limits: Record<string, { min: number; max: number }> = {};
    for (const cat of CATEGORIES) {
      const min = parseFloat(configValues[cat.key]?.min || "0");
      if (isNaN(min) || min < 0) {
        setFormError(`Valor inválido para ${cat.label}. Mínimo deve ser >= 0.`);
        return;
      }
      limits[cat.key] = { min, max: 99999 };
    }
    setFormError("");
    startTransition(async () => {
      const result = await updateSellerValueLimits(userId, limits);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? {
            ...u,
            sellerConfig: {
              minValue: u.sellerConfig?.minValue || 0,
              maxValue: u.sellerConfig?.maxValue || 99999,
              valueLimits: limits,
            },
          } : u)
        );
        setEditingConfig(null);
      }
    });
  };

  const openConfigEdit = (user: UserData) => {
    setEditingConfig(user.id);
    const vl = (user.sellerConfig?.valueLimits as any) || {};
    setConfigValues({
      regular:        { min: String(vl.regular?.min        ?? 0) },
      aproveitamento: { min: String(vl.aproveitamento?.min ?? 0) },
      competencia:    { min: String(vl.competencia?.min    ?? 0) },
      sequencial:     { min: String(vl.sequencial?.min     ?? 0) },
      eja:            { min: String(vl.eja?.min            ?? 0) },
      ingles:         { min: String(vl.ingles?.min         ?? 0) },
    });
    setFormError("");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Permissões de Acesso</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Gerencie os acessos e permissões de cada membro da equipe.</p>
        </div>
        {canManage && (
          <button
            onClick={() => { setShowNewUserModal(true); setNewUserForm({ name: "", email: "", password: "", role: "seller" }); setNewUserError(""); setNewUserSuccess(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-[13px] font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
        />
      </div>

      {/* Permission Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Usuário</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Cargo</th>
                {PERMISSION_MODULES.map((mod) => (
                  <th key={mod.key} className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">{mod.label}</th>
                ))}
                <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Limites</th>
                {canManage && <th className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => {
                const userPerms = permissions[user.id] || {};
                const isSelf = user.id === currentUserId;
                const isAdminRow = user.role === "admin" && !isCurrentUserAdmin;
                return (
                  <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${!user.active ? "opacity-50" : ""}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <span className="text-gray-600 text-[12px] font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 truncate">
                            {user.name}
                            {isSelf && <span className="text-gray-400 font-normal ml-1">(você)</span>}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {canChangeRoles && !isSelf && !isAdminRow ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isPending}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-0 appearance-none cursor-pointer ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"}`}
                        >
                          {Object.entries(ROLE_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex text-[11px] font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"}`}>
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      )}
                    </td>
                    {PERMISSION_MODULES.map((mod) => (
                      <td key={mod.key} className="px-3 py-3.5 text-center">
                        <Toggle
                          enabled={!!userPerms[mod.key]}
                          onChange={() => togglePermission(user.id, mod.key)}
                          disabled={!canManage || isSelf || isAdminRow}
                        />
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-center">
                      <Toggle
                        enabled={user.active}
                        onChange={() => handleToggleActive(user.id, user.active)}
                        disabled={!canManage || isSelf || isAdminRow}
                      />
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {canManage && (
                        <button
                          onClick={() => openConfigEdit(user)}
                          className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-orange-600 transition-colors"
                          title="Configurar limites de valor por categoria"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          {user.sellerConfig?.valueLimits && Object.keys(user.sellerConfig.valueLimits).length > 0 ? (
                            <span>Configurado</span>
                          ) : (
                            <span>Definir</span>
                          )}
                        </button>
                      )}
                    </td>
                    {canManage && (
                      <td className="px-3 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!isAdminRow && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Editar usuário"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {!isSelf && !isAdminRow && (
                            <button
                              onClick={() => { setDeleteConfirm(user); setActionError(""); }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Apagar usuário"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isAdminRow && (
                            <span className="text-[11px] text-gray-300 italic">protegido</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 6 + PERMISSION_MODULES.length : 5 + PERMISSION_MODULES.length} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save button */}
      {canManage && (
        <div className="flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-[13px] text-green-600 font-medium">Permissões salvas com sucesso!</span>
          )}
          <button
            onClick={handleSavePermissions}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white text-[13px] font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar Alterações
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setEditingUser(null); setActionError(""); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Editar Usuário</h2>
            {actionError && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{actionError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Nova Senha <span className="text-gray-400 font-normal">(deixe em branco para não alterar)</span></label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                  <button type="button" onClick={() => setShowEditPassword((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => { setEditingUser(null); setActionError(""); }} className="flex-1 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSaveEdit} disabled={isPending} className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-[13px] font-medium hover:bg-orange-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowNewUserModal(false); setNewUserError(""); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Novo Usuário</h2>
            {newUserSuccess && <p className="text-[13px] text-green-600 bg-green-50 px-3 py-2 rounded-lg">Usuário criado com sucesso!</p>}
            {newUserError && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{newUserError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                  <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Cargo</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                >
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => { setShowNewUserModal(false); setNewUserError(""); }} className="flex-1 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleCreateUser} disabled={isPending || newUserSuccess} className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-[13px] font-medium hover:bg-orange-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setDeleteConfirm(null); setActionError(""); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Apagar Usuário</h2>
            <p className="text-[13px] text-gray-600">
              Tem certeza que deseja apagar <span className="font-semibold text-gray-900">{deleteConfirm.name}</span>? Esta ação não pode ser desfeita. Os leads atribuídos a ele ficarão sem responsável.
            </p>
            {actionError && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{actionError}</p>}
            <div className="flex gap-3 pt-1">
              <button onClick={() => { setDeleteConfirm(null); setActionError(""); }} className="flex-1 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleDeleteUser} disabled={isPending} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-[13px] font-medium hover:bg-red-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Apagar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Config Modal - Per Category Limits */}
      {editingConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setEditingConfig(null); setFormError(""); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Limites de Valor por Categoria</h2>
            <p className="text-[13px] text-gray-500">
              Defina o valor mínimo e máximo para cada categoria de curso de <span className="font-medium text-gray-700">{users.find((u) => u.id === editingConfig)?.name}</span>.
            </p>
            {formError && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="text-[12px] font-semibold text-gray-700">{cat.label}</p>
                    <p className="text-[11px] text-gray-400">ref. {cat.refPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">Mín. R$</span>
                    <input
                      type="number" step="0.01" min="0"
                      value={configValues[cat.key]?.min || ""}
                      onChange={(e) => setConfigValues((prev) => ({
                        ...prev,
                        [cat.key]: { min: e.target.value },
                      }))}
                      className="w-full pl-20 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setEditingConfig(null); setFormError(""); }} className="flex-1 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleSaveConfig(editingConfig)} disabled={isPending} className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-[13px] font-medium hover:bg-orange-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
