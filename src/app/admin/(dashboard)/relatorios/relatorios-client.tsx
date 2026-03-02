"use client";

import { useState, useTransition, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingDown, Trophy, DollarSign, Users2, Search, Target, XCircle, Percent } from "lucide-react";
import { DateFilter } from "@/components/admin/date-filter";
import {
  getPerformanceReport,
  getSalesReport,
  getConversionReport,
  getLossReasonsReport,
  getSellerDetailReport,
} from "@/lib/actions/relatorios";

interface PerformanceItem {
  id: string;
  name: string;
  role: string;
  totalAssigned: number;
  converted: number;
  conversionRate: number;
  totalSales: number;
  revenue: number;
}

interface SalesData {
  salesByMonth: { label: string; sales: number; value: number }[];
  salesByCourse: { name: string; total: number; revenue: number }[];
  salesByPayment: { name: string; total: number; value: number }[];
  totalRevenue: number;
  totalSales: number;
  averageTicket: number;
}

interface ConversionData {
  totalLeads: number;
  funnel: { status: string; label: string; count: number; percentage: number }[];
  convertedTimeline: { label: string; value: number }[];
}

interface RelatoriosClientProps {
  performance: PerformanceItem[];
  sales: SalesData;
  conversion: ConversionData;
  lossReasons: { name: string; value: number }[];
}

const monthNames: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

const donutColors = ["#f97316", "#ec4899", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4"];
const paymentBarColors = ["#f97316", "#3b82f6", "#22c55e", "#8b5cf6"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);
}

function formatCurrencyShort(value: number) {
  if (value >= 1000) return `R$${Math.round(value / 1000)}k`;
  return `R$${value}`;
}

function formatLabel(label: string) {
  const parts = label.split("-");
  if (parts.length === 2) return monthNames[parts[1]] || parts[1];
  return label;
}

export function RelatoriosClient({ performance, sales, conversion, lossReasons: initialLossReasons }: RelatoriosClientProps) {
  const [activeTab, setActiveTab] = useState<"geral" | "vendedor">("geral");
  const [isPending, startTransition] = useTransition();

  // Geral tab state
  const [conversionData, setConversionData] = useState(conversion);
  const [salesData, setSalesData] = useState(sales);
  const [lossReasons, setLossReasons] = useState(initialLossReasons);

  // Vendedor tab state
  const [perfData, setPerfData] = useState(performance);
  const [selectedSeller, setSelectedSeller] = useState<PerformanceItem | null>(
    performance.length > 0 ? performance[0] : null
  );
  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerDetail, setSellerDetail] = useState<any>(null);

  // Load seller detail when selected seller changes
  useEffect(() => {
    if (!selectedSeller) { setSellerDetail(null); return; }
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    startTransition(async () => {
      const detail = await getSellerDetailReport(selectedSeller.id, start, end);
      setSellerDetail(detail);
    });
  }, [selectedSeller]);

  const handleGeralDateChange = (range: { start: string; end: string } | null) => {
    startTransition(async () => {
      const now = new Date();
      const start = range ? new Date(range.start + "T00:00:00") : new Date(now.getFullYear(), now.getMonth(), 1);
      const end = range ? new Date(range.end + "T23:59:59") : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const [newSales, newConversion, newLoss] = await Promise.all([
        getSalesReport(start, end),
        getConversionReport(start, end),
        getLossReasonsReport(start, end),
      ]);
      setSalesData(newSales);
      setConversionData(newConversion);
      setLossReasons(newLoss);
    });
  };

  const handleVendedorDateChange = (range: { start: string; end: string } | null) => {
    startTransition(async () => {
      const now = new Date();
      const start = range ? new Date(range.start + "T00:00:00") : new Date(now.getFullYear(), now.getMonth(), 1);
      const end = range ? new Date(range.end + "T23:59:59") : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const newPerf = await getPerformanceReport(start, end);
      setPerfData(newPerf);
      if (selectedSeller) {
        const detail = await getSellerDetailReport(selectedSeller.id, start, end);
        setSellerDetail(detail);
      }
    });
  };

  // Converted timeline
  const convertidosTimeline = (conversionData.convertedTimeline || []).map((d) => ({
    name: formatLabel(d.label),
    value: d.value,
  }));

  // Total leads perdidos
  const lostStep = conversionData.funnel.find((s) => s.status === "lost");
  const totalLost = lostStep?.count || 0;
  const totalLostPct = conversionData.totalLeads > 0 ? Number(((totalLost / conversionData.totalLeads) * 100).toFixed(1)) : 0;

  // Payment preference
  const paymentPreference = salesData.salesByPayment.length > 0 ? salesData.salesByPayment : [];

  // Total loss reasons sum
  const lossTotal = lossReasons.reduce((a, b) => a + b.value, 0);

  // Filter sellers
  const filteredSellers = perfData.filter((p) =>
    p.name.toLowerCase().includes(sellerSearch.toLowerCase())
  );

  // Seller detail chart data
  const sellerMonthlyData = (sellerDetail?.monthlyRevenue || []).map((d: any) => ({
    name: formatLabel(d.label),
    value: d.value,
  }));

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60 pointer-events-none" : ""} transition-opacity`}>
      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatórios de Performance</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Acompanhe métricas chave e desempenho da equipe.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateFilter onChange={activeTab === "geral" ? handleGeralDateChange : handleVendedorDateChange} />
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("geral")}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeTab === "geral" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab("vendedor")}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeTab === "vendedor" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Por Vendedor
            </button>
          </div>
        </div>
      </div>

      {/* ═══ VISÃO GERAL TAB ═══ */}
      {activeTab === "geral" && (
        <div className="space-y-5">
          {/* Top row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Leads Convertidos (Timeline)</h3>
              <div className="h-[240px]">
                {convertidosTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={convertidosTimeline}>
                      <defs>
                        <linearGradient id="colorConvertidos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.08} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        formatter={(value: number) => [value, "Convertidos"]}
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fill="url(#colorConvertidos)" dot={{ r: 3, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">Nenhum dado no período</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Leads Perdidos</h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">{totalLost}</span>
                  <span className="text-sm text-gray-500">leads</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-red-500 h-2 transition-all" style={{ width: `${Math.min(totalLostPct, 100)}%` }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 text-right">{totalLostPct}% da base total</p>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Motivos de Perda</h3>
              {lossReasons.length > 0 ? (
                <div className="flex items-center gap-6">
                  <div className="w-[180px] h-[180px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie data={lossReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3} strokeWidth={0}>
                          {lossReasons.map((_, i) => (
                            <Cell key={i} fill={donutColors[i % donutColors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 flex-1">
                    {lossReasons.map((reason, i) => (
                      <div key={reason.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                          <span className="text-[13px] text-gray-700 truncate max-w-[140px]">{reason.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[13px]">
                          <span className="text-gray-500 w-8 text-right">{reason.value}</span>
                          <span className="text-gray-400 w-10 text-right">{lossTotal > 0 ? Math.round((reason.value / lossTotal) * 100) : 0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">Nenhum dado no período</div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Preferência de Pagamento</h3>
              <div className="h-[200px]">
                {paymentPreference.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={paymentPreference} layout="vertical" barSize={24}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={110} />
                      <Tooltip formatter={(value: number) => [value, "Uso"]} contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                        {paymentPreference.map((_, i) => (
                          <Cell key={i} fill={paymentBarColors[i % paymentBarColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">Nenhum dado no período</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ POR VENDEDOR TAB ═══ */}
      {activeTab === "vendedor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Seller select + profile card */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users2 className="h-4 w-4 text-gray-500" />
                <h3 className="text-[13px] font-semibold text-gray-900">Equipe de Vendas</h3>
              </div>
              <div className="relative mb-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar vendedor..."
                  value={sellerSearch}
                  onChange={(e) => setSellerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>
              {sellerSearch && (
                <div className="mt-1 border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                  {filteredSellers.length > 0 ? filteredSellers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedSeller(p); setSellerSearch(""); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-orange-50 transition-colors"
                    >
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-semibold text-orange-600">{p.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-[13px] text-gray-700 truncate">{p.name}</span>
                    </button>
                  )) : (
                    <p className="text-center text-gray-400 text-[12px] py-3">Nenhum resultado</p>
                  )}
                </div>
              )}
            </div>

            {/* Seller list - all sellers with stats */}
            {!sellerSearch && perfData.length > 0 && (
              <div className="space-y-1.5">
                {perfData.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedSeller(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      selectedSeller?.id === p.id
                        ? "bg-orange-50 border border-orange-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      selectedSeller?.id === p.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      <span className="text-[11px] font-bold">{p.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] font-medium truncate ${selectedSeller?.id === p.id ? "text-orange-700" : "text-gray-700"}`}>{p.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-gray-400">{p.converted} conv.</span>
                        <span className="text-[11px] text-gray-400">{formatCurrency(p.revenue)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Detailed KPIs + Charts */}
          <div className="lg:col-span-9 space-y-5">
            {selectedSeller && sellerDetail ? (
              <>
                {/* 4 KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[12px] text-gray-500 font-medium">Conversões</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{sellerDetail.converted}</p>
                        <p className="text-[11px] text-gray-400 mt-1">de {sellerDetail.totalAssigned} leads</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg"><Trophy className="h-4 w-4 text-green-500" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[12px] text-gray-500 font-medium">Taxa de Conversão</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{sellerDetail.conversionRate}%</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg"><Target className="h-4 w-4 text-blue-500" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[12px] text-gray-500 font-medium">Taxa de Perda</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{sellerDetail.lossRate}%</p>
                        <p className="text-[11px] text-gray-400 mt-1">{sellerDetail.lost} leads perdidos</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-lg"><XCircle className="h-4 w-4 text-red-500" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-[12px] text-gray-500 font-medium">Ticket Médio</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(sellerDetail.ticketMedio)}</p>
                        <p className="text-[11px] text-gray-400 mt-1">Equipe: {formatCurrency(salesData.averageTicket)}</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded-lg shrink-0"><DollarSign className="h-4 w-4 text-orange-500" /></div>
                    </div>
                  </div>
                </div>

                {/* Monthly performance chart */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Desempenho Mensal (Receita)</h3>
                  <div className="h-[260px]">
                    {sellerMonthlyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={sellerMonthlyData}>
                          <defs>
                            <linearGradient id="colorSeller" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
                          <Tooltip formatter={(value: number) => [formatCurrency(value), "Receita"]} contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorSeller)" dot={{ r: 3, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">Nenhum dado no período</div>
                    )}
                  </div>
                </div>

                {/* Loss reasons ranking */}
                {sellerDetail.lossReasons.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Ranking de Motivos de Perda</h3>
                    <div className="space-y-3">
                      {sellerDetail.lossReasons.map((r: any, i: number) => {
                        const total = sellerDetail.lossReasons.reduce((a: number, b: any) => a + b.value, 0);
                        const pct = total > 0 ? Math.round((r.value / total) * 100) : 0;
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[13px] text-gray-700">{r.name}</span>
                              <span className="text-[12px] text-gray-500">{r.value} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: donutColors[i % donutColors.length] }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : selectedSeller ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <p className="text-gray-400 text-sm">Carregando dados...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <p className="text-gray-400 text-sm">Selecione um vendedor para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
