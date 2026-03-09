import { getPerformanceReport, getSalesReport, getConversionReport, getLossReasonsReport, getLeadDistributionReport } from "@/lib/actions/relatorios";
import { RelatoriosClient } from "./relatorios-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RelatoriosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as any)?.role || "";
  const isAdmin = userRole === "admin";
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [performance, sales, conversion, lossReasons, distribution] = await Promise.all([
    getPerformanceReport(startDate, endDate),
    getSalesReport(startDate, endDate),
    getConversionReport(startDate, endDate),
    getLossReasonsReport(startDate, endDate),
    isAdmin
      ? getLeadDistributionReport(startDate, endDate)
      : Promise.resolve({ totals: { sessions: 0, whatsappClicks: 0, emails: 0, duplicates: 0 }, sellers: [] }),
  ]);

  return (
    <RelatoriosClient
      performance={JSON.parse(JSON.stringify(performance))}
      sales={JSON.parse(JSON.stringify(sales))}
      conversion={JSON.parse(JSON.stringify(conversion))}
      lossReasons={JSON.parse(JSON.stringify(lossReasons))}
      distribution={JSON.parse(JSON.stringify(distribution))}
      isAdmin={isAdmin}
    />
  );
}
