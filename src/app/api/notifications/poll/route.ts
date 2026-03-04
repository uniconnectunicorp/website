import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since");
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 30000);

    const notificacoes = await prisma.notificacao.findMany({
      where: {
        userId: session.user.id,
        lida: false,
        createdAt: { gt: sinceDate },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ notificacoes });
  } catch (error) {
    console.error("GET /api/notifications/poll error:", error);
    return NextResponse.json({ notificacoes: [] });
  }
}
