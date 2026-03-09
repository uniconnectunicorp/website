import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotificacoes } from "@/lib/actions/notificacoes";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificacoes = await getNotificacoes(session.user.id, (session.user as any).role);

    return NextResponse.json(notificacoes);
  } catch (error) {
    console.error("GET /api/notificacoes error:", error);
    return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 });
  }
}
