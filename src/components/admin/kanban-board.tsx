"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  updateLeadStatus,
  convertLead,
  generateEnrollmentLink,
  addLeadManually,
  getLeadsPipeline,
  updateLeadValue,
  updateLeadCourse,
} from "@/lib/actions/leads";
import { LeadDetailModal } from "@/components/admin/lead-detail-modal";
import { CourseSearchSelect } from "@/components/admin/course-search-select";
import {
  Phone, User, Search, Loader2, Plus, MoreVertical, Link2, Eye,
  DollarSign, XCircle, CheckCircle, Copy, Check, ExternalLink, Filter, BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  course?: string | null;
  courseValue?: number | null;
  status: string;
  notes?: string | null;
  assignedTo?: string | null;
  assignedUser?: { id: string; name: string } | null;
  source?: string | null;
  enrollmentLink?: { token: string; used: boolean } | null;
  paymentMethod?: { name: string } | null;
  lossReason?: string | null;
  createdAt: string;
}

interface KanbanBoardProps {
  initialColumns: Record<string, Lead[]>;
  sellers: { id: string; name: string }[];
  paymentMethods: any[];
  currentUser: { id: string; name: string; role: string };
}

const columnConfig = [
  { id: "pending", title: "Novos Leads", dot: "bg-blue-500", bg: "bg-blue-50/40" },
  { id: "contacted", title: "Em Contato", dot: "bg-yellow-500", bg: "bg-yellow-50/40" },
  { id: "negociating", title: "Proposta Enviada", dot: "bg-orange-500", bg: "bg-orange-50/40" },
  { id: "confirmPayment", title: "Em Negociação", dot: "bg-purple-500", bg: "bg-purple-50/40" },
  { id: "enrolled", title: "Matriculado", dot: "bg-teal-500", bg: "bg-teal-50/40" },
  { id: "converted", title: "Convertidos", dot: "bg-green-500", bg: "bg-green-50/40" },
  { id: "lost", title: "Perdidos", dot: "bg-red-500", bg: "bg-red-50/40" },
];

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function KanbanBoard({ initialColumns, sellers, paymentMethods, currentUser }: KanbanBoardProps) {
  const router = useRouter();
  const [columns, setColumns] = useState(initialColumns);
  const [isPending, startTransition] = useTransition();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");

  // Modals
  const [actionMenuLead, setActionMenuLead] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState<Lead | null>(null);
  const [showLossModal, setShowLossModal] = useState<Lead | null>(null);
  const [showValueModal, setShowValueModal] = useState<Lead | null>(null);
  const [showLinkModal, setShowLinkModal] = useState<{ leadId: string; url: string } | null>(null);
  const [showCourseModal, setShowCourseModal] = useState<Lead | null>(null);

  // Form states
  const [newLead, setNewLead] = useState({ name: "", phone: "", course: "" });
  const [lossReason, setLossReason] = useState("");
  const [selectedPM, setSelectedPM] = useState("");
  const [installments, setInstallments] = useState(1);
  const [newValue, setNewValue] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newCourseModality, setNewCourseModality] = useState("");
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const canSeeAllLeads = ["admin", "director", "manager"].includes(currentUser.role);

  const refreshData = useCallback(() => {
    startTransition(async () => {
      const fresh = await getLeadsPipeline({
        userRole: currentUser.role,
        userId: currentUser.id,
        sellerId: sellerFilter || undefined,
        search: search || undefined,
      });
      setColumns(fresh as any);
    });
  }, [currentUser, sellerFilter, search, startTransition]);

  // Auto-refresh pipeline every 30s (realtime sem F5)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Don't allow dragging directly to converted (needs payment modal)
    if (destination.droppableId === "converted") {
      const lead = (columns[source.droppableId] || []).find((l) => l.id === draggableId);
      if (lead) {
        setShowConvertModal(lead);
        return;
      }
    }

    // Don't allow dragging directly to lost (needs reason)
    if (destination.droppableId === "lost") {
      const lead = (columns[source.droppableId] || []).find((l) => l.id === draggableId);
      if (lead) {
        setShowLossModal(lead);
        return;
      }
    }

    const sourceCol = [...(columns[source.droppableId] || [])];
    const destCol = source.droppableId === destination.droppableId
      ? sourceCol
      : [...(columns[destination.droppableId] || [])];

    const [moved] = sourceCol.splice(source.index, 1);
    moved.status = destination.droppableId;
    destCol.splice(destination.index, 0, moved);

    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: sourceCol,
      ...(source.droppableId !== destination.droppableId ? { [destination.droppableId]: destCol } : {}),
    }));

    startTransition(async () => {
      await updateLeadStatus(draggableId, destination.droppableId, currentUser.id);
    });
  };

  const filterLeads = (leads: Lead[]) => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.course?.toLowerCase().includes(q)
    );
  };

  const handleAddLead = () => {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      setFormError("Nome e telefone são obrigatórios");
      return;
    }
    setFormError("");
    startTransition(async () => {
      const result = await addLeadManually({
        name: newLead.name,
        phone: newLead.phone,
        course: newLead.course || undefined,
        assignedTo: currentUser.id,
      });
      if (result && "error" in result && result.error) {
        setFormError(result.error);
      } else {
        setNewLead({ name: "", phone: "", course: "" });
        setShowAddLead(false);
        refreshData();
      }
    });
  };

  const handleConvert = () => {
    if (!showConvertModal || !selectedPM) return;
    startTransition(async () => {
      await convertLead(showConvertModal.id, selectedPM, installments, currentUser.id);
      setShowConvertModal(null);
      setSelectedPM("");
      setInstallments(1);
      refreshData();
    });
  };

  const handleMarkLost = () => {
    if (!showLossModal || !lossReason.trim()) return;
    startTransition(async () => {
      await updateLeadStatus(showLossModal.id, "lost", currentUser.id, { lossReason });
      setShowLossModal(null);
      setLossReason("");
      refreshData();
    });
  };

  const handleUpdateCourse = () => {
    if (!showCourseModal || !newCourse.trim()) return;
    startTransition(async () => {
      await updateLeadCourse(showCourseModal.id, newCourse.trim(), currentUser.id);
      setShowCourseModal(null);
      setNewCourse("");
      setNewCourseModality("");
      refreshData();
    });
  };

  const handleGenerateLink = (leadId: string) => {
    startTransition(async () => {
      const result = await generateEnrollmentLink(leadId, currentUser.id);
      if (result?.url) {
        const fullUrl = `${window.location.origin}${result.url}`;
        setShowLinkModal({ leadId, url: fullUrl });
        refreshData();
      }
      setActionMenuLead(null);
    });
  };

  const handleUpdateValue = () => {
    if (!showValueModal || !newValue) return;
    startTransition(async () => {
      const result = await updateLeadValue(showValueModal.id, parseFloat(newValue), currentUser.id);
      if (result && "error" in result && result.error) {
        setFormError(result.error);
      } else {
        setShowValueModal(null);
        setNewValue("");
        setFormError("");
        refreshData();
      }
    });
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header - Pipeline de Vendas */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900">Pipeline de Vendas</h1>
      </div>

      {/* Filters row: search + EQUIPE avatars + Novo Lead */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); }}
            onKeyDown={(e) => e.key === "Enter" && refreshData()}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
          />
        </div>

        {/* EQUIPE avatars filter */}
        {canSeeAllLeads && sellers.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Equipe:</span>
            <select
              value={sellerFilter}
              onChange={(e) => {
                const val = e.target.value;
                setSellerFilter(val);
                startTransition(async () => {
                  const fresh = await getLeadsPipeline({
                    userRole: currentUser.role,
                    userId: currentUser.id,
                    sellerId: val || undefined,
                    search: search || undefined,
                  });
                  setColumns(fresh as any);
                });
              }}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            >
              <option value="">Todos</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => setShowAddLead(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Lead
        </button>
      </div>

      {/* Kanban columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 mt-3">
          {columnConfig.map((col) => {
            const leads = filterLeads(columns[col.id] || []);
            return (
              <div key={col.id} className="min-w-[270px] w-[270px] shrink-0">
                <div className="px-3 py-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <h3 className="text-[13px] font-semibold text-gray-800">{col.title}</h3>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {leads.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 ml-4">Quantidade de Leads: {String(leads.length).padStart(2, "0")}</p>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto px-1.5 pb-2 space-y-2 transition-colors ${
                        snapshot.isDraggingOver ? col.bg : ""
                      }`}
                    >
                      {leads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-xl p-3.5 border border-gray-100 cursor-grab hover:shadow-md transition-all group ${
                                snapshot.isDragging ? "shadow-xl rotate-1 ring-2 ring-orange-200" : ""
                              }`}
                            >
                              <div className="space-y-2">
                                {/* Name + Actions */}
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-gray-900 truncate">{lead.name}</p>
                                    {lead.course && (
                                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{lead.course}</p>
                                    )}
                                    {lead.assignedUser && (
                                      <p className="text-[11px] text-gray-400 mt-0.5">Responsável: {lead.assignedUser.name}</p>
                                    )}
                                  </div>

                                  {/* Action menu trigger */}
                                  <div className="relative">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setActionMenuLead(actionMenuLead === lead.id ? null : lead.id); }}
                                      className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </button>

                                    {actionMenuLead === lead.id && (
                                      <>
                                        <div className="fixed inset-0 z-30" onClick={() => setActionMenuLead(null)} />
                                        <div className="absolute right-0 top-7 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-40 py-1.5 text-sm">
                                          <button onClick={() => { setSelectedLead(lead); setActionMenuLead(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-gray-700">
                                            <Eye className="h-4 w-4 text-gray-400" /> Ver detalhes
                                          </button>
                                          {lead.status !== "converted" && lead.status !== "lost" && (
                                            <>
                                              <button onClick={() => handleGenerateLink(lead.id)} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-gray-700">
                                                <Link2 className="h-4 w-4 text-blue-500" /> Link de matrícula
                                              </button>
                                              <button onClick={() => { setShowValueModal(lead); setNewValue(String(lead.courseValue || "")); setActionMenuLead(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-gray-700">
                                                <DollarSign className="h-4 w-4 text-green-500" /> Editar valor
                                              </button>
                                              <button onClick={() => { setShowCourseModal(lead); setNewCourse(lead.course || ""); setActionMenuLead(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-gray-700">
                                                <BookOpen className="h-4 w-4 text-blue-500" /> Trocar curso
                                              </button>
                                              <div className="border-t border-gray-100 my-1" />
                                              <button onClick={() => { setShowConvertModal(lead); setActionMenuLead(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-green-600">
                                                <CheckCircle className="h-4 w-4" /> Marcar convertido
                                              </button>
                                              <button onClick={() => { setShowLossModal(lead); setActionMenuLead(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-red-600">
                                                <XCircle className="h-4 w-4" /> Marcar perdido
                                              </button>
                                            </>
                                          )}
                                          <div className="border-t border-gray-100 my-1" />
                                          <a
                                            href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setActionMenuLead(null)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-green-700"
                                          >
                                            <Phone className="h-4 w-4" /> WhatsApp
                                          </a>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Date + Avatar */}
                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {(() => {
                                      const diff = Date.now() - new Date(lead.createdAt).getTime();
                                      const hours = Math.floor(diff / 3600000);
                                      const days = Math.floor(diff / 86400000);
                                      if (hours < 1) return "Agora";
                                      if (hours < 24) return `${hours} horas atrás`;
                                      if (days === 1) return "Ontem";
                                      if (days < 7) return `${days} dias atrás`;
                                      return new Date(lead.createdAt).toLocaleDateString("pt-BR");
                                    })()}
                                  </div>
                                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-semibold text-gray-600">
                                      {(lead.assignedUser?.name || lead.name).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>

                                {/* Enrollment link indicator */}
                                {lead.enrollmentLink && !lead.enrollmentLink.used && (
                                  <div className="flex items-center gap-1 text-[11px] text-blue-500">
                                    <Link2 className="h-3 w-3" /> Link ativo
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {leads.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">Nenhum lead</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ─── MODALS ─── */}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddLead(false); setFormError(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Novo Lead</h2>
            {formError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
            <input
              type="text" placeholder="Nome *" value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <input
              type="text" placeholder="Telefone *" value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <CourseSearchSelect
              value={newLead.course}
              onChange={(val) => setNewLead({ ...newLead, course: val })}
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowAddLead(false); setFormError(""); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleAddLead} disabled={isPending} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Criar Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Lead Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConvertModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Converter Lead</h2>
            <p className="text-sm text-gray-500">Selecione a forma de pagamento para <span className="font-medium text-gray-700">{showConvertModal.name}</span></p>
            {showConvertModal.courseValue && (
              <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                Valor: {formatCurrency(showConvertModal.courseValue)}
              </p>
            )}
            <select
              value={selectedPM}
              onChange={(e) => {
                setSelectedPM(e.target.value);
                const pm = paymentMethods.find((p: any) => p.id === e.target.value);
                if (pm) setInstallments(pm.maxInstallments || 1);
              }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="">Forma de pagamento...</option>
              {paymentMethods.map((pm: any) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name} {pm.feePercentage > 0 ? `(${pm.feePercentage}% taxa)` : "(sem taxa)"}
                </option>
              ))}
            </select>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowConvertModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleConvert} disabled={isPending || !selectedPM} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirmar Conversão"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loss Reason Modal */}
      {showLossModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLossModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Marcar como Perdido</h2>
            <p className="text-sm text-gray-500">Informe o motivo da perda de <span className="font-medium text-gray-700">{showLossModal.name}</span></p>
            <select
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="">Selecione o motivo...</option>
              <option value="Preço muito alto">Preço muito alto</option>
              <option value="Sem interesse no momento">Sem interesse no momento</option>
              <option value="Optou por outra instituição">Optou por outra instituição</option>
              <option value="Não respondeu">Não respondeu</option>
              <option value="Problemas financeiros">Problemas financeiros</option>
              <option value="Mudou de cidade">Mudou de cidade</option>
              <option value="Curso não disponível">Curso não disponível na modalidade desejada</option>
              <option value="Desistência pessoal">Desistência pessoal</option>
            </select>
            {!lossReason && (
              <input
                type="text"
                placeholder="Ou digite um motivo personalizado..."
                onChange={(e) => setLossReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowLossModal(null); setLossReason(""); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleMarkLost} disabled={isPending || !lossReason.trim()} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirmar Perda"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Value Modal */}
      {showValueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowValueModal(null); setFormError(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Editar Valor</h2>
            {formError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">R$</span>
              <input
                type="number" step="0.01" value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowValueModal(null); setFormError(""); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleUpdateValue} disabled={isPending || !newValue} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLinkModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Link de Matrícula</h2>
            <p className="text-sm text-gray-500">Envie este link para o aluno realizar a matrícula. O link é de uso único.</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="text" readOnly value={showLinkModal.url}
                className="flex-1 text-sm text-gray-700 bg-transparent outline-none truncate"
              />
              <button onClick={() => copyLink(showLinkModal.url)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLinkModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Fechar</button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Olá! Segue o link para sua matrícula: ${showLinkModal.url}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium text-center hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Enviar via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Trocar Curso Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowCourseModal(null); setNewCourse(""); setNewCourseModality(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Trocar Curso</h2>
            <p className="text-sm text-gray-500">Altere o curso de interesse de <span className="font-medium text-gray-700">{showCourseModal.name}</span></p>
            <CourseSearchSelect
              value={newCourse}
              initialModality={newCourseModality}
              onChange={(val, mod) => { setNewCourse(val); if (mod !== undefined) setNewCourseModality(mod); }}
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowCourseModal(null); setNewCourse(""); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleUpdateCourse} disabled={isPending || !newCourse.trim()} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
