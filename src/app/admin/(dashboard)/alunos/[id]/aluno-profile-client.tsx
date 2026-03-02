"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Calendar,
  User,
  CreditCard,
  MessageSquare,
  Send,
  Loader2,
  Clock,
  DollarSign,
  FileText,
  FileCheck,
  FileX,
  CheckCircle2,
} from "lucide-react";
import { addAlunoObservacao, toggleNotaEmitida } from "@/lib/actions/alunos";

interface History {
  id: string;
  action: string;
  createdAt: string;
}

interface Finance {
  id: string;
  amount: number;
  installments?: number | null;
  paymentMethod?: string | null;
  transactionDate?: string | null;
}

interface Matricula {
  id: string;
  numero: string;
  notaEmitida: boolean;
  dataNotaEmitida?: string | null;
}

interface Aluno {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
  rg?: string | null;
  birthDate?: string | null;
  address?: string | null;
  houseNumber?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  civilStatus?: string | null;
  course?: string | null;
  status: string;
  notes?: string | null;
  source?: string | null;
  createdAt: string;
  history: History[];
  finance?: Finance | null;
  matricula?: Matricula | null;
}

interface AlunoProfileClientProps {
  aluno: Aluno;
  userRole: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function AlunoProfileClient({ aluno, userRole }: AlunoProfileClientProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [notaEmitida, setNotaEmitida] = useState(aluno.matricula?.notaEmitida || false);

  const canManageNota = ["admin", "director", "finance"].includes(userRole);

  const handleToggleNota = () => {
    startTransition(async () => {
      const result = await toggleNotaEmitida(aluno.id, !notaEmitida);
      if ("success" in result) {
        setNotaEmitida(!notaEmitida);
        router.refresh();
      }
    });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    startTransition(async () => {
      await addAlunoObservacao(aluno.id, note);
      setNote("");
      router.refresh();
    });
  };

  const address = [aluno.address, aluno.houseNumber, aluno.neighborhood, aluno.city, aluno.state, aluno.zipCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Back button + Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/alunos"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil do Aluno</h1>
          <p className="text-sm text-gray-500 mt-0.5">{aluno.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {aluno.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{aluno.name}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                  Matriculado
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={Phone} label="Telefone" value={aluno.phone} />
              {aluno.email && <InfoItem icon={Mail} label="Email" value={aluno.email} />}
              {aluno.cpf && <InfoItem icon={User} label="CPF" value={aluno.cpf} />}
              {aluno.rg && <InfoItem icon={FileText} label="RG" value={aluno.rg} />}
              {aluno.birthDate && <InfoItem icon={Calendar} label="Data de Nascimento" value={aluno.birthDate} />}
              {aluno.civilStatus && <InfoItem icon={User} label="Estado Civil" value={aluno.civilStatus} />}
              {address && <InfoItem icon={MapPin} label="Endereço" value={address} className="sm:col-span-2" />}
            </div>
          </div>

          {/* Course & Payment Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Curso e Pagamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aluno.course && (
                <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                  <BookOpen className="h-5 w-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-xs text-orange-400">Curso</p>
                    <p className="text-sm font-medium text-orange-700">{aluno.course}</p>
                  </div>
                </div>
              )}
              {aluno.finance && (
                <>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <DollarSign className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs text-green-400">Valor</p>
                      <p className="text-sm font-medium text-green-700">{formatCurrency(aluno.finance.amount)}</p>
                    </div>
                  </div>
                  {aluno.finance.paymentMethod && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <CreditCard className="h-5 w-5 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs text-blue-400">Forma de Pagamento</p>
                        <p className="text-sm font-medium text-blue-700">{aluno.finance.paymentMethod}</p>
                      </div>
                    </div>
                  )}
                  {aluno.finance.installments && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Parcelas</p>
                        <p className="text-sm font-medium text-gray-700">{aluno.finance.installments}x</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              <InfoItem icon={Calendar} label="Data da Matrícula" value={new Date(aluno.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} />
              {aluno.source && <InfoItem icon={FileText} label="Origem" value={aluno.source} />}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
            {aluno.notes && (
              <div className="p-4 bg-gray-50 rounded-xl mb-4 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-line">{aluno.notes}</p>
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
                className="px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ações Rápidas</h3>
            {/* Nota Emitida Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${notaEmitida ? "bg-green-50" : "bg-gray-50"}`}>
              {notaEmitida ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <FileX className="h-5 w-5 text-gray-400 shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-xs text-gray-400">Nota Fiscal</p>
                <p className={`text-sm font-medium ${notaEmitida ? "text-green-700" : "text-gray-500"}`}>
                  {notaEmitida ? "Emitida" : "Pendente"}
                </p>
              </div>
              {canManageNota && (
                <button
                  onClick={handleToggleNota}
                  disabled={isPending}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
                    notaEmitida
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {notaEmitida ? "Remover" : "Emitir"}
                </button>
              )}
            </div>

            <a
              href={`https://wa.me/55${aluno.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              Abrir WhatsApp
            </a>
            {aluno.email && (
              <a
                href={`mailto:${aluno.email}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                Enviar Email
              </a>
            )}
          </div>

          {/* History Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico</h3>
            {aluno.history.length > 0 ? (
              <div className="space-y-4">
                {aluno.history.map((h, i) => (
                  <div key={h.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${i === 0 ? "bg-orange-500" : "bg-gray-300"}`} />
                      {i < aluno.history.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-gray-700">{h.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(h.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Nenhum histórico</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: any;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl ${className}`}>
      <Icon className="h-4 w-4 text-gray-400 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}
