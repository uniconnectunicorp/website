import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { NavigationProgress } from "@/components/admin/navigation-progress";
import { getNotificacoes } from "@/lib/actions/notificacoes";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

export const metadata = {
  title: "UniConnect - Admin",
  description: "Painel administrativo UniConnect",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (e) {
    // Session validation failed
  }

  if (!session) {
    redirect("/admin/login");
  }

  const [notificacoes, dbUser] = await Promise.all([
    getNotificacoes(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { permissions: true },
    }),
  ]);

  const userWithPerms = {
    ...(session.user as any),
    permissions: dbUser?.permissions || null,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <AdminSidebar user={userWithPerms} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          user={session.user as any}
          notificacoes={JSON.parse(JSON.stringify(notificacoes))}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
