"use client";

import { useState, useTransition } from "react";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { DateFilter } from "./date-filter";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getDashboardKPIs,
  getRevenueChart,
  getLeadsByStatusChart,
  getTopSellers,
  getEntradasSaidasChart,
} from "@/lib/actions/dashboard";

function formatCurrency(value: number) {
  if (value >= 1000) return `R$${Math.round(value / 1000)}k`;
  return `R$${value}`;
}

function formatCurrencyFull(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

const monthNames: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

function formatLabel(label: string) {
  const parts = label.split("-");
  if (parts.length === 2) return monthNames[parts[1]] || parts[1];
  return label;
}

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  sparkData?: number[];
  sparkColor?: string;
}

function KpiCard({ title, value, change, sparkData, sparkColor = "#22c55e" }: KpiCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNegativeGood = title.toLowerCase().includes("inadimpl");

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-1">
        <p className="text-[13px] text-gray-500 font-medium leading-tight">{title}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${
            isNegativeGood
              ? (change <= 0 ? "text-green-600" : "text-red-500")
              : (isPositive ? "text-green-600" : "text-red-500")
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-3">{value}</p>
      {/* Mini sparkline */}
      <div className="h-8">
        {sparkData && sparkData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={sparkData.map((v, i) => ({ v, i }))}>
              <defs>
                <linearGradient id={`spark-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#spark-${title.replace(/\s/g, "")})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded" />
        )}
      </div>
    </div>
  );
}

interface DashboardClientProps {
  initialKpis: any;
  initialRevenue: any[];
  initialLeadsByStatus: any[];
  initialRecentLeads: any[];
  initialTopSellers: any[];
  initialEntradasSaidas: any[];
}

export function DashboardClient({
  initialKpis,
  initialRevenue,
  initialLeadsByStatus,
  initialRecentLeads,
  initialTopSellers,
  initialEntradasSaidas,
}: DashboardClientProps) {
  const [kpis, setKpis] = useState(initialKpis);
  const [revenueData, setRevenueData] = useState(initialRevenue);
  const [leadsByStatus, setLeadsByStatus] = useState(initialLeadsByStatus);
  const [entradasSaidas, setEntradasSaidas] = useState(initialEntradasSaidas);
  const [isPending, startTransition] = useTransition();

  const handleDateChange = (range: { start: string; end: string } | null) => {
    startTransition(async () => {
      const dateRange = range || undefined;
      const [newKpis, newRevenue, newStatus, newSellers, newES] = await Promise.all([
        getDashboardKPIs(dateRange),
        getRevenueChart(dateRange),
        getLeadsByStatusChart(dateRange),
        getTopSellers(dateRange),
        getEntradasSaidasChart(dateRange),
      ]);
      setKpis(newKpis);
      setRevenueData(newRevenue);
      setLeadsByStatus(newStatus);
      setEntradasSaidas(newES);
    });
  };

  const handleExport = () => {
    const rows = [
      ["Indicador", "Valor"],
      ["Matrículas", String(kpis?.matriculasFeitas || 0)],
      ["Faturamento", String(kpis?.revenue || 0)],
      ["Taxa de Conversão", `${kpis?.conversionRate || 0}%`],
      ["Novos Leads", String(kpis?.totalLeads || 0)],
      [],
      ["Mês", "Receita"],
      ...revenueData.map((d: any) => [d.label, String(d.value)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-dashboard-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const growthChartData = revenueData.map((d: any) => ({
    name: formatLabel(d.label),
    value: d.value,
  }));

  // Real entradas vs saídas data from DB
  const entradasSaidasData = entradasSaidas.map((d: any) => ({
    name: formatLabel(d.label),
    entradas: d.entradas,
    saidas: d.saidas,
  }));

  // Sparkline data derived from revenue chart
  const sparkRevenue = revenueData.map((d: any) => d.value);
  const sparkEntradas = entradasSaidas.map((d: any) => d.entradas);
  const sparkSaidas = entradasSaidas.map((d: any) => d.saidas);

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60 pointer-events-none" : ""} transition-opacity`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Visão Geral da Escola</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Acompanhe os indicadores chave da sua instituição.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateFilter onChange={handleDateChange} />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Exportar Relatórios
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Matrículas"
          value={kpis?.matriculasFeitas?.toLocaleString("pt-BR") || "0"}
          change={kpis?.matriculasChange}
          sparkData={sparkRevenue.length > 0 ? sparkRevenue : undefined}
          sparkColor="#22c55e"
        />
        <KpiCard
          title="Faturamento"
          value={formatCurrencyFull(kpis?.revenue || 0)}
          change={kpis?.revenueChange}
          sparkData={sparkRevenue.length > 0 ? sparkRevenue : undefined}
          sparkColor="#22c55e"
        />
        <KpiCard
          title="Taxa de Conversão"
          value={`${kpis?.conversionRate || 0}%`}
          change={kpis?.conversionRateChange}
          sparkData={sparkEntradas.length > 0 ? sparkEntradas : undefined}
          sparkColor="#3b82f6"
        />
        <KpiCard
          title="Novos Leads"
          value={kpis?.totalLeads?.toLocaleString("pt-BR") || "0"}
          change={kpis?.leadsChange}
          sparkData={sparkSaidas.length > 0 ? sparkSaidas : undefined}
          sparkColor="#f97316"
        />
      </div>

      {/* Charts - 2 columns matching Figma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Crescimento de Alunos */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Crescimento de Alunos</h3>
          <div className="h-[280px]">
            {growthChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={growthChartData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString("pt-BR"), "Alunos"]}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#colorGrowth)"
                    dot={{ r: 3, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        {/* Entradas vs Saídas */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Entradas vs Saídas</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={entradasSaidasData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrencyFull(value),
                    name === "entradas" ? "Entradas" : "Saídas",
                  ]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  formatter={(value) => (value === "entradas" ? "Entradas" : "Saídas")}
                />
                <Bar dataKey="entradas" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="saidas" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
