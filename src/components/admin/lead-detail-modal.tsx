"use client";

import { useState, useTransition } from "react";
import { X, Phone, Mail, MapPin, BookOpen, Clock, MessageSquare, Send, Loader2, User } from "lucide-react";
import { addLeadNote, updateLeadData } from "@/lib/actions/leads";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  course?: string | null;
  status: string;
  notes?: string | null;
  assignedTo?: string | null;
  source?: string | null;
  cpf?: string | null;
  city?: string | null;
  state?: string | null;
  lossReason?: string | null;
  createdAt: string;
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

const statusLabels: Record<string, string> = {
  pending: "Novo",
  contacted: "Em Contato",
  negociating: "Negociação",
  confirmPayment: "Conf. Pagamento",
  converted: "Convertido",
  lost: "Perdido",
};

const statusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700",
  contacted: "bg-blue-100 text-blue-700",
  negociating: "bg-purple-100 text-purple-700",
  confirmPayment: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [lossReason, setLossReason] = useState(lead.lossReason || "");
  const [isPending, startTransition] = useTransition();

  const handleAddNote = () => {
    if (!note.trim()) return;
    startTransition(async () => {
      await addLeadNote(lead.id, note);
      setNote("");
      router.refresh();
    });
  };

  const handleUpdateLossReason = () => {
    if (!lossReason.trim()) return;
    startTransition(async () => {
      await updateLeadData(lead.id, { lossReason });
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{lead.name}</h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] || "bg-gray-100 text-gray-700"}`}>
                {statusLabels[lead.status] || lead.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contato</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.email}</span>
                </div>
              )}
              {(lead.city || lead.state) && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {[lead.city, lead.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Course & Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Detalhes</h3>
            <div className="grid grid-cols-1 gap-3">
              {lead.course && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <BookOpen className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-700 font-medium">{lead.course}</span>
                </div>
              )}
              {lead.cpf && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">CPF: {lead.cpf}</span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  Criado em {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {lead.source && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500">Origem:</span>
                  <span className="text-sm text-gray-700">{lead.source}</span>
                </div>
              )}
            </div>
          </div>

          {/* Loss Reason (only for lost leads) */}
          {lead.status === "lost" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Motivo da Perda</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lossReason}
                  onChange={(e) => setLossReason(e.target.value)}
                  placeholder="Motivo da perda..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button
                  onClick={handleUpdateLossReason}
                  disabled={isPending}
                  className="px-3 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Observações</h3>
            {lead.notes && (
              <div className="p-3 bg-gray-50 rounded-xl max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-line">{lead.notes}</p>
              </div>
            )}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Adicionar observação..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <button
                onClick={handleAddNote}
                disabled={isPending || !note.trim()}
                className="px-3 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* WhatsApp Quick Action */}
          <a
            href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
          >
            <Phone className="h-4 w-4" />
            Abrir WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
