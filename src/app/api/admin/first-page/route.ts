import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NAV_ITEMS = [
  { href: "/admin", roles: ["admin", "director", "finance"], permKey: "dashboard" },
  { href: "/admin/crm-pipeline", roles: ["admin", "director", "manager", "seller"], permKey: "crm" },
  { href: "/admin/relatorios", roles: ["admin", "director", "manager", "finance"], permKey: "relatorios" },
  { href: "/admin/matriculas", roles: ["admin", "director", "manager"], permKey: "matriculas" },
  { href: "/admin/financeiro", roles: ["admin", "director", "finance"], permKey: "financeiro" },
  { href: "/admin/usuarios", roles: ["admin", "director", "manager"], permKey: null },
];

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ url: "/admin" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, permissions: true },
  });

  if (!user) return NextResponse.json({ url: "/admin" });

  const perms = user.permissions as Record<string, boolean> | null;
  const hasCustomPerms = perms && typeof perms === "object" && Object.keys(perms).length > 0;

  for (const item of NAV_ITEMS) {
    if (hasCustomPerms && item.permKey) {
      if (perms![item.permKey] === true) return NextResponse.json({ url: item.href });
    } else {
      if (item.roles.includes(user.role)) return NextResponse.json({ url: item.href });
    }
  }

  return NextResponse.json({ url: "/admin" });
}
