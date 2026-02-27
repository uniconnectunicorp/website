import { getPerformanceReport, getSalesReport, getConversionReport, getLossReasonsReport } from "@/lib/actions/relatorios";
import { RelatoriosClient } from "./relatorios-client";

export default async function RelatoriosPage() {
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 86400000);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [performance, sales, conversion, lossReasons] = await Promise.all([
    getPerformanceReport(startDate, endDate),
    getSalesReport(startDate, endDate),
    getConversionReport(startDate, endDate),
    getLossReasonsReport(startDate, endDate),
  ]);

  return (
    <RelatoriosClient
      performance={JSON.parse(JSON.stringify(performance))}
      sales={JSON.parse(JSON.stringify(sales))}
      conversion={JSON.parse(JSON.stringify(conversion))}
      lossReasons={JSON.parse(JSON.stringify(lossReasons))}
    />
  );
}
