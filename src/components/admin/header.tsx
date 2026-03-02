"use client";

import { useState, useTransition } from "react";
import { Bell, Search, Check, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { marcarNotificacaoLida, marcarTodasLidas } from "@/lib/actions/notificacoes";
import { useRouter } from "next/navigation";
import { useNotificacoes } from "@/hooks/use-notificacoes";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  linkUrl?: string | null;
  createdAt: string;
}

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
  notificacoes: Notificacao[];
}

const pageTitles: Record<string, string> = {
  "/admin": "Visão Geral",
  "/admin/crm-pipeline": "CRM Pipeline",
  "/admin/relatorios": "Relatórios de Performance",
  "/admin/matriculas": "Gestão de Matrículas",
  "/admin/financeiro": "Financeiro",
  "/admin/usuarios": "Permissões de Acesso",
};

const tipoConfig: Record<string, { icon: any; color: string; bg: string }> = {
  info:    { icon: Info,          color: "text-blue-600",   bg: "bg-blue-50" },
  sucesso: { icon: CheckCircle,   color: "text-green-600",  bg: "bg-green-50" },
  alerta:  { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  erro:    { icon: XCircle,       color: "text-red-600",    bg: "bg-red-50" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "agora";
  if (mins < 60)  return `${mins}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return `${days}d atrás`;
}

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path) && path !== "/admin") return title;
  }
  return "Visão Geral";
}

export function AdminHeader({ user, notificacoes: initialNotificacoes }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { notificacoes, refetch } = useNotificacoes(initialNotificacoes);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  const pageTitle = getPageTitle(pathname);

  const handleMarcarLida = (id: string) => {
    startTransition(async () => {
      await marcarNotificacaoLida(id);
      refetch();
    });
  };

  const handleMarcarTodas = () => {
    startTransition(async () => {
      await marcarTodasLidas(user.id);
      refetch();
    });
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      {/* Page Title */}
      <h1 className="text-[15px] font-semibold text-gray-900">{pageTitle}</h1>

      {/* Right side: Search + Bell */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar em todo o sistema..."
            className="w-[240px] pl-9 pr-10 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="h-[18px] w-[18px]" />
            {naoLidas > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </button>

          {open && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

              {/* Dropdown */}
              <div className="absolute right-0 top-11 w-[360px] bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                    {naoLidas > 0 && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                        {naoLidas}
                      </span>
                    )}
                  </div>
                  {naoLidas > 0 && (
                    <button
                      onClick={handleMarcarTodas}
                      disabled={isPending}
                      className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                  {notificacoes.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notificacoes.map((n) => {
                      const cfg = tipoConfig[n.tipo] || tipoConfig.info;
                      const Icon = cfg.icon;
                      const content = (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.lida ? "bg-orange-50/30" : ""}`}
                        >
                          <div className={`${cfg.bg} p-2 rounded-xl shrink-0 mt-0.5`}>
                            <Icon className={`h-4 w-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${n.lida ? "text-gray-600" : "text-gray-900"}`}>
                              {n.titulo}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.mensagem}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                          </div>
                          {!n.lida && (
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMarcarLida(n.id); }}
                              className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors shrink-0"
                              title="Marcar como lida"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      );

                      return n.linkUrl ? (
                        <Link key={n.id} href={n.linkUrl} onClick={() => { setOpen(false); handleMarcarLida(n.id); }}>
                          {content}
                        </Link>
                      ) : (
                        <div key={n.id}>{content}</div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
