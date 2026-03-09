import "server-only";

import pg from "pg";

export const CRM_PIPELINE_CHANNEL = "__crm_pipeline__";

export type CRMRealtimeEvent = {
  type: "lead_pipeline_changed";
  leadId?: string;
};

type Subscriber = (event: CRMRealtimeEvent) => void;

declare global {
  var crmRealtimeClient: pg.Client | undefined;
  var crmRealtimeReady: Promise<pg.Client> | undefined;
  var crmRealtimeSubscribers: Map<string, Set<Subscriber>> | undefined;
}

const subscribers = globalThis.crmRealtimeSubscribers ?? new Map<string, Set<Subscriber>>();

if (!globalThis.crmRealtimeSubscribers) {
  globalThis.crmRealtimeSubscribers = subscribers;
}

function getConnectionString() {
  return process.env.DIRECT_URL || process.env.CRM_DATABASE_URL;
}

async function createRealtimeClient() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("DIRECT_URL ou CRM_DATABASE_URL não configurada para realtime do CRM");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query("LISTEN crm_pipeline_realtime");

  client.on("notification", (msg) => {
    if (!msg.payload) return;

    try {
      const event = JSON.parse(msg.payload) as CRMRealtimeEvent;
      const channelSubscribers = subscribers.get(CRM_PIPELINE_CHANNEL);
      channelSubscribers?.forEach((callback) => callback(event));
    } catch (error) {
      console.error("crm realtime parse error:", error);
    }
  });

  client.on("error", (error) => {
    console.error("crm realtime listener error:", error);
    globalThis.crmRealtimeClient = undefined;
    globalThis.crmRealtimeReady = undefined;
  });

  globalThis.crmRealtimeClient = client;
  return client;
}

export async function ensureCRMRealtime() {
  if (globalThis.crmRealtimeClient) {
    return globalThis.crmRealtimeClient;
  }

  if (!globalThis.crmRealtimeReady) {
    globalThis.crmRealtimeReady = createRealtimeClient();
  }

  return globalThis.crmRealtimeReady;
}

export function subscribeToCRM(callback: Subscriber) {
  const current = subscribers.get(CRM_PIPELINE_CHANNEL) ?? new Set<Subscriber>();
  current.add(callback);
  subscribers.set(CRM_PIPELINE_CHANNEL, current);

  return () => {
    const set = subscribers.get(CRM_PIPELINE_CHANNEL);
    if (!set) return;
    set.delete(callback);
    if (set.size === 0) {
      subscribers.delete(CRM_PIPELINE_CHANNEL);
    }
  };
}

export async function publishCRMEvent(event: CRMRealtimeEvent) {
  const connectionString = getConnectionString();
  if (!connectionString) return;

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    await client.query("SELECT pg_notify($1, $2)", ["crm_pipeline_realtime", JSON.stringify(event)]);
  } catch (error) {
    console.error("publishCRMEvent error:", error);
  } finally {
    await client.end().catch(() => undefined);
  }
}
