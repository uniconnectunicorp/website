import { DashboardClient } from "@/components/admin/dashboard-client";
import {
  getDashboardKPIs,
  getRevenueChart,
  getLeadsByStatusChart,
  getRecentLeads,
  getTopSellers,
  getEntradasSaidasChart,
} from "@/lib/actions/dashboard";

export default async function AdminDashboardPage() {
  const [kpis, revenueData, leadsByStatus, recentLeads, topSellers, entradasSaidas] = await Promise.all([
    getDashboardKPIs(),
    getRevenueChart(),
    getLeadsByStatusChart(),
    getRecentLeads(),
    getTopSellers(),
    getEntradasSaidasChart(),
  ]);

  return (
    <DashboardClient
      initialKpis={kpis}
      initialRevenue={revenueData}
      initialLeadsByStatus={leadsByStatus}
      initialRecentLeads={JSON.parse(JSON.stringify(recentLeads))}
      initialTopSellers={topSellers}
      initialEntradasSaidas={entradasSaidas}
    />
  );
}
