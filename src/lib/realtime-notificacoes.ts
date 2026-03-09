import "server-only";

import pg from "pg";

export const ADMIN_NOTIFICATIONS_CHANNEL = "__admin__";

export type NotificacaoRealtimeEvent =
  | {
      type: "notificacao_criada";
      userId: string;
      notificacao: {
        id: string;
        userId: string;
        recipientName?: string | null;
        titulo: string;
        mensagem: string;
        tipo: string;
        lida: boolean;
        linkUrl?: string | null;
        createdAt: string;
      };
    }
  | {
      type: "notificacao_lida";
      userId: string;
      notificacaoId: string;
    }
  | {
      type: "notificacoes_lidas";
      userId: string;
    };

type Subscriber = (event: NotificacaoRealtimeEvent) => void;

declare global {
  var notificacoesRealtimeClient: pg.Client | undefined;
  var notificacoesRealtimeReady: Promise<pg.Client> | undefined;
  var notificacoesRealtimeSubscribers: Map<string, Set<Subscriber>> | undefined;
}

const subscribers =
  globalThis.notificacoesRealtimeSubscribers ?? new Map<string, Set<Subscriber>>();

if (!globalThis.notificacoesRealtimeSubscribers) {
  globalThis.notificacoesRealtimeSubscribers = subscribers;
}

function getListenerConnectionString() {
  return process.env.DIRECT_URL || process.env.CRM_DATABASE_URL;
}

async function createRealtimeClient() {
  const connectionString = getListenerConnectionString();
  if (!connectionString) {
    throw new Error("DIRECT_URL ou CRM_DATABASE_URL não configurada para realtime de notificações");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query("LISTEN notifications_realtime");

  client.on("notification", (msg) => {
    if (!msg.payload) return;

    try {
      const event = JSON.parse(msg.payload) as NotificacaoRealtimeEvent;
      const userSubscribers = subscribers.get(event.userId);
      userSubscribers?.forEach((callback) => callback(event));

      const adminSubscribers = subscribers.get(ADMIN_NOTIFICATIONS_CHANNEL);
      adminSubscribers?.forEach((callback) => callback(event));
    } catch (error) {
      console.error("notifications realtime parse error:", error);
    }
  });

  client.on("error", (error) => {
    console.error("notifications realtime listener error:", error);
    globalThis.notificacoesRealtimeClient = undefined;
    globalThis.notificacoesRealtimeReady = undefined;
  });

  globalThis.notificacoesRealtimeClient = client;
  return client;
}

export async function ensureNotificationsRealtime() {
  if (globalThis.notificacoesRealtimeClient) {
    return globalThis.notificacoesRealtimeClient;
  }

  if (!globalThis.notificacoesRealtimeReady) {
    globalThis.notificacoesRealtimeReady = createRealtimeClient();
  }

  return globalThis.notificacoesRealtimeReady;
}

export function subscribeToNotifications(userId: string, callback: Subscriber) {
  const current = subscribers.get(userId) ?? new Set<Subscriber>();
  current.add(callback);
  subscribers.set(userId, current);

  return () => {
    const set = subscribers.get(userId);
    if (!set) return;
    set.delete(callback);
    if (set.size === 0) {
      subscribers.delete(userId);
    }
  };
}

export async function publishNotificationEvent(event: NotificacaoRealtimeEvent) {
  const connectionString = getListenerConnectionString();
  if (!connectionString) return;

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    await client.query("SELECT pg_notify($1, $2)", ["notifications_realtime", JSON.stringify(event)]);
  } catch (error) {
    console.error("publishNotificationEvent error:", error);
  } finally {
    await client.end().catch(() => undefined);
  }
}
