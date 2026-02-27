"use client";

import { useState, useTransition } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Plus, CreditCard, Loader2, Percent, ToggleLeft, ToggleRight, Receipt,
} from "lucide-react";
import { DateFilter } from "@/components/admin/date-filter";
import {
  getFinanceOverview,
  getPaymentMethodStats,
  createFinanceEntry,
  updatePaymentMethod,
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
} from "@/lib/actions/financeiro";
import { PaymentType } from "@prisma/client";

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

interface FinanceiroClientProps {
  initialOverview: any;
  initialPMStats: any[];
  allPaymentMethods: any[];
  userId: string;
  userRole: string;
}

export function FinanceiroClient({
  initialOverview,
  initialPMStats,
  allPaymentMethods,
  userId,
  userRole,
}: FinanceiroClientProps) {
  const [overview, setOverview] = useState(initialOverview);
  const [pmStats, setPMStats] = useState(initialPMStats);
  const [paymentMethods, setPaymentMethods] = useState(allPaymentMethods);
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"overview" | "methods">("overview");
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showAddPM, setShowAddPM] = useState(false);
  const [newEntry, setNewEntry] = useState({ amount: "", type: "out" as "in" | "out", category: "", description: "" });
  const [newPM, setNewPM] = useState({ name: "", type: "pix", feePercentage: "0", maxInstallments: "1", visibleOnEnrollment: true });
  const [formError, setFormError] = useState("");
  const [pmFormError, setPmFormError] = useState("");

  const canManage = ["admin", "director"].includes(userRole);

  const handleDateChange = (range: { start: string; end: string } | null) => {
    startTransition(async () => {
      const dr = range || undefined;
      const [ov, pm] = await Promise.all([
        getFinanceOverview(dr),
        getPaymentMethodStats(dr),
      ]);
      setOverview(ov);
      setPMStats(pm);
    });
  };

  const handleAddEntry = () => {
    if (!newEntry.amount || !newEntry.category || !newEntry.description) {
      setFormError("Todos os campos são obrigatórios");
      return;
    }
    setFormError("");
    startTransition(async () => {
      const result = await createFinanceEntry({
        amount: parseFloat(newEntry.amount),
        type: newEntry.type,
        category: newEntry.category,
        description: newEntry.description,
        userId,
      });
      if ("error" in result) {
        setFormError(result.error!);
      } else {
        setNewEntry({ amount: "", type: "out", category: "", description: "" });
        setShowAddEntry(false);
        const fresh = await getFinanceOverview();
        setOverview(fresh);
      }
    });
  };

  const handleTogglePM = (id: string, field: "active" | "visibleOnEnrollment", current: boolean) => {
    startTransition(async () => {
      await updatePaymentMethod(id, { [field]: !current });
      setPaymentMethods((prev) =>
        prev.map((pm) => pm.id === id ? { ...pm, [field]: !current } : pm)
      );
    });
  };

  const handleCreatePM = () => {
    if (!newPM.name) { setPmFormError("Nome é obrigatório"); return; }
    setPmFormError("");
    startTransition(async () => {
      const result = await createPaymentMethod({
        name: newPM.name,
        type: newPM.type as PaymentType,
        feePercentage: parseFloat(newPM.feePercentage) || 0,
        maxInstallments: parseInt(newPM.maxInstallments) || 1,
        visibleOnEnrollment: newPM.visibleOnEnrollment,
      });
      if ("error" in result) {
        setPmFormError(result.error!);
      } else {
        setNewPM({ name: "", type: "pix", feePercentage: "0", maxInstallments: "1", visibleOnEnrollment: true });
        setShowAddPM(false);
        const fresh = await getAllPaymentMethods();
        setPaymentMethods(fresh);
      }
    });
  };

  const handleDeletePM = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta forma de pagamento?")) return;
    startTransition(async () => {
      const result = await deletePaymentMethod(id);
      if ("error" in result) {
        alert(result.error);
      } else {
        setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      }
    });
  };

  return (
    <div className={`space-y-6 ${isPending ? "opacity-60 pointer-events-none" : ""} transition-opacity`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Controle de entradas, saídas e taxas</p>
        </div>
        <div className="flex items-center gap-3">
          <DateFilter onChange={handleDateChange} />
          {canManage && (
            <button
              onClick={() => setShowAddEntry(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Lançamento
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(overview.totalIn)}</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg shrink-0">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{overview.enrollmentCount} matrículas</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Despesas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(overview.totalOut)}</p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg shrink-0">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className={`text-2xl font-bold mt-1 ${overview.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {fmt(overview.balance)}
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxas de Cartão</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{fmt(overview.totalFees)}</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg shrink-0">
                <Percent className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Líquido: {fmt(overview.totalNet)}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Lançamentos
        </button>
        <button
          onClick={() => setTab("methods")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "methods" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Formas de Pagamento
        </button>
      </div>

      {/* Tab Content */}
      {tab === "overview" && overview && (
        <div className="space-y-6">
          {/* Payment Method Stats */}
          {pmStats.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Forma de Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pmStats.filter((pm: any) => pm.count > 0).map((pm: any, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{pm.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        pm.type === "pix" ? "bg-green-100 text-green-700" :
                        pm.type === "credit" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {pm.type === "pix" ? "PIX" : pm.type === "credit" ? "Crédito" : "Débito"}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{fmt(pm.totalAmount)}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{pm.count} transações</span>
                      {pm.totalFees > 0 && (
                        <span className="text-xs text-red-500">Taxa: {fmt(pm.totalFees)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entries Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Lançamentos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Data</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Tipo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Descrição</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Pagamento</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Valor</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Taxa</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Líquido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {overview.entries.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(entry.transactionDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                          entry.type === "out"
                            ? "bg-red-100 text-red-700"
                            : entry.type === "leadPayment"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {entry.type === "out" ? (
                            <><ArrowDownRight className="h-3 w-3" /> Saída</>
                          ) : entry.type === "leadPayment" ? (
                            <><Receipt className="h-3 w-3" /> Matrícula</>
                          ) : (
                            <><ArrowUpRight className="h-3 w-3" /> Entrada</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-900 truncate max-w-[250px]">{entry.description}</p>
                        {entry.leadName && (
                          <p className="text-xs text-gray-500">{entry.leadName}</p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {entry.paymentMethodName || "—"}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-right">
                        <span className={entry.type === "out" ? "text-red-600" : "text-green-600"}>
                          {entry.type === "out" ? "-" : "+"}{fmt(entry.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-red-500">
                        {entry.feeAmount > 0 ? fmt(entry.feeAmount) : "—"}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                        {fmt(entry.netAmount)}
                      </td>
                    </tr>
                  ))}
                  {overview.entries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        Nenhum lançamento no período
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "methods" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">Formas de Pagamento</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">Gerencie as formas de pagamento e taxas</p>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddPM(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Forma
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Nome</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Tipo</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Parcelas</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Taxa %</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ativo</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Visível na Matrícula</th>
                  {canManage && <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentMethods.map((pm: any) => (
                  <tr key={pm.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{pm.name}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        pm.type === "pix" ? "bg-green-100 text-green-700" :
                        pm.type === "credit" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {pm.type === "pix" ? "PIX" : pm.type === "credit" ? "Crédito" : "Débito"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 text-center">{pm.maxInstallments || "—"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 text-center">{pm.feePercentage}%</td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => canManage && handleTogglePM(pm.id, "active", pm.active)}
                        disabled={!canManage}
                        className="transition-colors disabled:opacity-50"
                      >
                        {pm.active ? (
                          <ToggleRight className="h-6 w-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => canManage && handleTogglePM(pm.id, "visibleOnEnrollment", pm.visibleOnEnrollment)}
                        disabled={!canManage}
                        className="transition-colors disabled:opacity-50"
                      >
                        {pm.visibleOnEnrollment ? (
                          <ToggleRight className="h-6 w-6 text-blue-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-300" />
                        )}
                      </button>
                    </td>
                    {canManage && (
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDeletePM(pm.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddPM(false); setPmFormError(""); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Nova Forma de Pagamento</h2>
            {pmFormError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{pmFormError}</p>}

            <input
              type="text" placeholder="Nome (ex: PIX, Cartão 12x...)" value={newPM.name}
              onChange={(e) => setNewPM({ ...newPM, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />

            <select
              value={newPM.type}
              onChange={(e) => setNewPM({ ...newPM, type: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="pix">PIX</option>
              <option value="credit">Cartão de Crédito</option>
              <option value="debit">Cartão de Débito</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Taxa %</label>
                <input
                  type="number" step="0.01" value={newPM.feePercentage}
                  onChange={(e) => setNewPM({ ...newPM, feePercentage: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Máx. Parcelas</label>
                <input
                  type="number" min="1" value={newPM.maxInstallments}
                  onChange={(e) => setNewPM({ ...newPM, maxInstallments: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={newPM.visibleOnEnrollment}
                onChange={(e) => setNewPM({ ...newPM, visibleOnEnrollment: e.target.checked })}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Visível na página de matrícula</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowAddPM(false); setPmFormError(""); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleCreatePM} disabled={isPending} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddEntry(false); setFormError(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Novo Lançamento</h2>
            {formError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setNewEntry({ ...newEntry, type: "in" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  newEntry.type === "in" ? "bg-green-500 text-white" : "border border-gray-200 text-gray-600"
                }`}
              >
                Entrada
              </button>
              <button
                onClick={() => setNewEntry({ ...newEntry, type: "out" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  newEntry.type === "out" ? "bg-red-500 text-white" : "border border-gray-200 text-gray-600"
                }`}
              >
                Saída
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">R$</span>
              <input
                type="number" step="0.01" placeholder="0,00" value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <select
              value={newEntry.category}
              onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="">Categoria...</option>
              <option value="aluguel">Aluguel</option>
              <option value="marketing">Marketing</option>
              <option value="material">Material</option>
              <option value="internet">Internet/Telefonia</option>
              <option value="salarios">Salários</option>
              <option value="outros">Outros</option>
            </select>

            <input
              type="text" placeholder="Descrição *" value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowAddEntry(false); setFormError(""); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleAddEntry} disabled={isPending} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Criar Lançamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
