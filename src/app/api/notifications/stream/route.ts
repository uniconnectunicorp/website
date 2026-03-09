import { auth } from "@/lib/auth";
import { getNotificacoes } from "@/lib/actions/notificacoes";
import { ADMIN_NOTIFICATIONS_CHANNEL, ensureNotificationsRealtime, subscribeToNotifications } from "@/lib/realtime-notificacoes";
import { headers } from "next/headers";

const DEBUG_SSE = process.env.DEBUG_SSE === "true";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await ensureNotificationsRealtime();

  const encoder = new TextEncoder();
  const userId = session.user.id;
  const channelId = (session.user as any).role === "admin" ? ADMIN_NOTIFICATIONS_CHANNEL : userId;
  const userRole = (session.user as any).role;

  if (DEBUG_SSE) {
    console.log("[SSE][Notificacoes][Server] conexão iniciada", { userId, userRole, channelId });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (event: string, data: unknown) => {
        if (DEBUG_SSE && event !== "keepalive") {
          console.log("[SSE][Notificacoes][Server] enviando evento", { event, userId, channelId });
        }
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const initial = await getNotificacoes(userId, userRole);
      if (DEBUG_SSE) {
        console.log("[SSE][Notificacoes][Server] snapshot inicial", { userId, total: initial.length });
      }
      push("snapshot", { notificacoes: initial });

      const unsubscribe = subscribeToNotifications(channelId, (event) => {
        push("message", event);
      });

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: keepalive\n\n`));
      }, 25000);

      const cleanup = () => {
        if (DEBUG_SSE) {
          console.log("[SSE][Notificacoes][Server] cleanup", { userId, channelId });
        }
        clearInterval(keepAlive);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      };

      request.signal.addEventListener("abort", cleanup, { once: true });
    },
    cancel() {
      return;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
