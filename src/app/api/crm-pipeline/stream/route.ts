import { auth } from "@/lib/auth";
import { ensureCRMRealtime, subscribeToCRM } from "@/lib/realtime-crm";
import { headers } from "next/headers";

const DEBUG_SSE = process.env.DEBUG_SSE === "true";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await ensureCRMRealtime();

  if (DEBUG_SSE) {
    console.log("[SSE][CRM][Server] conexão iniciada", { userId: session.user.id, role: (session.user as any).role });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (event: string, data: unknown) => {
        if (DEBUG_SSE && event !== "keepalive") {
          console.log("[SSE][CRM][Server] enviando evento", { event, data });
        }
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      push("ready", { ok: true });

      const unsubscribe = subscribeToCRM((event) => {
        push("message", event);
      });

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: keepalive\n\n`));
      }, 25000);

      const cleanup = () => {
        if (DEBUG_SSE) {
          console.log("[SSE][CRM][Server] cleanup", { userId: session.user.id });
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
