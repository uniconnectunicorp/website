import { notFound } from "next/navigation";
import { getMatriculaByNumero } from "@/lib/actions/matriculas";
import {
  ArrowLeft,
  GraduationCap,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Hash,
} from "lucide-react";
import Link from "next/link";

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ativa:     { label: "Ativa",     color: "bg-green-50 text-green-700 border border-green-200" },
  concluida: { label: "Concluída", color: "bg-blue-50 text-blue-700 border border-blue-200" },
  cancelada: { label: "Cancelada", color: "bg-red-50 text-red-700 border border-red-200" },
  trancada:  { label: "Trancada",  color: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
};

const modalidadeConfig: Record<string, { label: string; color: string }> = {
  regular:        { label: "Regular",        color: "bg-orange-50 text-orange-700 border border-orange-200" },
  aproveitamento: { label: "Aproveitamento", color: "bg-purple-50 text-purple-700 border border-purple-200" },
  competencia:    { label: "Competência",    color: "bg-blue-50 text-blue-700 border border-blue-200" },
};

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[13px] text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default async function MatriculaDetailPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const decoded = decodeURIComponent(numero);
  const matricula = await getMatriculaByNumero(decoded);

  if (!matricula) notFound();

  const lead = matricula.lead;
  const finance = lead.finance;
  const sc = statusConfig[matricula.status] || { label: matricula.status, color: "bg-gray-100 text-gray-700" };
  const mc = modalidadeConfig[matricula.modalidade] || { label: matricula.modalidade, color: "bg-gray-50 text-gray-600 border border-gray-200" };
  const valor = finance?.amount ?? lead.courseValue ?? 0;
  const paymentMethodName = (finance as any)?.paymentMethod?.name ?? null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/matriculas"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{lead.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${sc.color}`}>
              {sc.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${mc.color}`}>
              {mc.label}
            </span>
          </div>
          <p className="text-[12px] font-mono text-orange-500 mt-0.5">{matricula.numero}</p>
        </div>
        {lead.phone && (
          <a
            href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[13px] font-medium transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Personal Data */}
        <div className="lg:col-span-2 space-y-5">
          {/* Student card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-400" />
              Dados do Aluno
            </h2>
            <div>
              {lead.email && <InfoRow icon={Mail} label="E-mail" value={lead.email} />}
              <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
              {lead.cpf && <InfoRow icon={Hash} label="CPF" value={lead.cpf} />}
              {lead.rg && <InfoRow icon={Hash} label="RG" value={lead.rg} />}
              {lead.birthDate && (
                <InfoRow
                  icon={Calendar}
                  label="Data de Nascimento"
                  value={new Date(lead.birthDate).toLocaleDateString("pt-BR")}
                />
              )}
              {lead.civilStatus && (
                <InfoRow icon={User} label="Estado Civil" value={lead.civilStatus.charAt(0).toUpperCase() + lead.civilStatus.slice(1)} />
              )}
            </div>
          </div>

          {/* Address */}
          {(lead.address || lead.city) && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-[13px] font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                Endereço
              </h2>
              <div>
                {lead.address && (
                  <InfoRow
                    icon={MapPin}
                    label="Logradouro"
                    value={`${lead.address}${lead.houseNumber ? ", " + lead.houseNumber : ""}${lead.neighborhood ? " — " + lead.neighborhood : ""}`}
                  />
                )}
                {lead.city && (
                  <InfoRow icon={MapPin} label="Cidade / Estado" value={`${lead.city}${lead.state ? " — " + lead.state : ""}`} />
                )}
                {lead.zipCode && <InfoRow icon={MapPin} label="CEP" value={lead.zipCode} />}
              </div>
            </div>
          )}

          {/* History */}
          {lead.history && lead.history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-[13px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                Histórico do Lead
              </h2>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-100" />
                <div className="space-y-4">
                  {lead.history.map((h: any, i: number) => (
                    <div key={h.id} className="relative flex items-start gap-3 pl-8">
                      <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-white border-2 border-orange-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-gray-700">{h.action}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(h.createdAt).toLocaleString("pt-BR", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Enrollment + Financial */}
        <div className="space-y-5">
          {/* Course info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
              Matrícula
            </h2>
            <div>
              <InfoRow icon={GraduationCap} label="Curso" value={lead.course || "—"} />
              <InfoRow icon={GraduationCap} label="Modalidade" value={mc.label} />
              <InfoRow
                icon={Calendar}
                label="Data de Início"
                value={new Date(matricula.dataInicio).toLocaleDateString("pt-BR")}
              />
              {matricula.dataConclusao && (
                <InfoRow
                  icon={CheckCircle2}
                  label="Data de Conclusão"
                  value={new Date(matricula.dataConclusao).toLocaleDateString("pt-BR")}
                />
              )}
              {matricula.observacoes && (
                <InfoRow icon={FileText} label="Observações" value={matricula.observacoes} />
              )}
            </div>
          </div>

          {/* Financial */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-gray-400" />
              Financeiro
            </h2>
            <div>
              <InfoRow icon={CreditCard} label="Valor" value={fmt(valor)} />
              {finance?.netAmount && finance.netAmount !== valor && (
                <InfoRow icon={CreditCard} label="Valor Líquido" value={fmt(finance.netAmount)} />
              )}
              {finance?.feeAmount && finance.feeAmount > 0 && (
                <InfoRow icon={CreditCard} label="Taxa" value={fmt(finance.feeAmount)} />
              )}
              {paymentMethodName && (
                <InfoRow icon={CreditCard} label="Forma de Pagamento" value={paymentMethodName} />
              )}
              {lead.installments && lead.installments > 1 && (
                <InfoRow icon={CreditCard} label="Parcelas" value={`${lead.installments}x`} />
              )}
            </div>
          </div>

          {/* Seller */}
          {lead.assignedUser && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-[13px] font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-gray-400" />
                Vendedor Responsável
              </h2>
              <div>
                <InfoRow icon={User} label="Nome" value={(lead.assignedUser as any).name || "—"} />
                <InfoRow icon={Mail} label="E-mail" value={(lead.assignedUser as any).email || "—"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
