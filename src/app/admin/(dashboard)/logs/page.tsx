import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getLogs, getLogStats, getDistinctUsers } from "@/lib/actions/logs";
import { LogsClient } from "./logs-client";

export const metadata = { title: "Logs do Sistema — UniConnect" };

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "admin") {
    redirect("/admin");
  }

  const sp = await searchParams;
  const page = parseInt(sp.page || "1");

  const [{ logs, total, pages }, stats, users] = await Promise.all([
    getLogs({
      userId: sp.userId || undefined,
      entity: sp.entity || undefined,
      action: sp.action || undefined,
      dateFrom: sp.dateFrom || undefined,
      dateTo: sp.dateTo || undefined,
      search: sp.search || undefined,
      page,
      limit: 50,
    }),
    getLogStats(),
    getDistinctUsers(),
  ]);

  return (
    <LogsClient
      logs={JSON.parse(JSON.stringify(logs))}
      total={total}
      pages={pages}
      currentPage={page}
      stats={stats}
      users={JSON.parse(JSON.stringify(users))}
      filters={{
        userId: sp.userId || "",
        entity: sp.entity || "",
        action: sp.action || "",
        dateFrom: sp.dateFrom || "",
        dateTo: sp.dateTo || "",
        search: sp.search || "",
      }}
    />
  );
}
