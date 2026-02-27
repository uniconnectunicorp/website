"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  FileText,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

type NavItem = {
  href: string;
  label: string;
  icon: any;
  roles: string[];
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  director: "Diretor",
  manager: "Gerente de Vendas",
  seller: "Vendedor",
  finance: "Financeiro",
  user: "Usuário",
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "director", "finance"] },
  { href: "/admin/crm-pipeline", label: "CRM", icon: Kanban, roles: ["admin", "director", "manager", "seller"] },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3, roles: ["admin", "director", "manager", "finance"] },
  { href: "/admin/matriculas", label: "Matrículas", icon: FileText, roles: ["admin", "director", "manager"] },
  { href: "/admin/financeiro", label: "Financeiro", icon: DollarSign, roles: ["admin", "director", "finance"] },
  { href: "/admin/usuarios", label: "Permissões", icon: Settings, roles: ["admin", "director", "manager"] },
];

export function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const userInitial = user.name?.charAt(0)?.toUpperCase() || "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-base font-bold">{userInitial}</span>
          </div>
          <h2 className="text-orange-500 font-bold text-xl tracking-tight">UniConnect</h2>
        </div>
      </div>

      {/* Menu Label */}
      <div className="px-6 pt-2 pb-3">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Menu Principal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.filter((item) => item.roles.includes(user.role)).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 ${
                active
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"}`} />
              <span>{item.label}</span>
              {active && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info at bottom */}
      <div className="px-4 py-4 mt-auto border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-sm font-semibold">{userInitial}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{roleLabels[user.role] || user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-xl shadow-lg"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-[220px] bg-white shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:w-[220px] lg:shrink-0 border-r border-gray-100">
        <div className="w-full">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
