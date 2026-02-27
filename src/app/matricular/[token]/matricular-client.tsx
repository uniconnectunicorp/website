"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, MapPin, CreditCard, BookOpen,
  Calendar, FileText, Home, CheckCircle, Loader2, GraduationCap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  course?: string | null;
  courseValue?: number | null;
  modalidade?: string | null;
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
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  maxInstallments?: number | null;
  feePercentage: number;
}

interface MatricularClientProps {
  token: string;
  lead: Lead;
  sellerName: string;
  paymentMethods: PaymentMethod[];
}

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const estadosCivis = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao-estavel", label: "União Estável" },
];

function maskCPF(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
}
function maskPhone(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{4})\d+?$/, "$1");
}
function maskCEP(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");
}
function maskDate(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{4})\d+?$/, "$1");
}

export function MatricularClient({ token, lead, sellerName, paymentMethods }: MatricularClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: lead.name || "",
    birthDate: lead.birthDate || "",
    cpf: lead.cpf || "",
    rg: lead.rg || "",
    maritalStatus: lead.civilStatus || "",
    phone: lead.phone || "",
    email: lead.email || "",
    street: lead.address || "",
    number: lead.houseNumber || "",
    neighborhood: lead.neighborhood || "",
    city: lead.city || "",
    state: lead.state || "",
    cep: lead.zipCode || "",
    paymentMethodId: "",
    installments: "1",
  });

  const selectedPM = paymentMethods.find((p) => p.id === form.paymentMethodId);
  const maxInstallments = selectedPM?.maxInstallments || 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cpf") v = maskCPF(value);
    if (name === "phone") v = maskPhone(value);
    if (name === "cep") v = maskCEP(value);
    if (name === "birthDate") v = maskDate(value);
    setForm((p) => ({ ...p, [name]: v }));
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((p) => ({
          ...p,
          street: data.logradouro || p.street,
          neighborhood: data.bairro || p.neighborhood,
          city: data.localidade || p.city,
          state: data.uf || p.state,
        }));
      }
    } catch {}
    setLoadingCep(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.cpf || !form.paymentMethodId) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/enrollment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Erro ao processar matrícula.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Matrícula Realizada!</h1>
          <p className="text-gray-600">
            Sua matrícula foi processada com sucesso. Em breve nossa equipe entrará em contato para os próximos passos.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-[#0b3b75] text-white rounded-xl font-medium hover:bg-[#0a3060] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" /> Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0b3b75] via-[#0b3b75] to-[#0b3b75] pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-10 mb-4">Complete sua Matrícula</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
            Você está a poucos passos de transformar sua carreira profissional!
          </p>
          {lead.course && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <GraduationCap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">
                Curso: <span className="font-bold text-yellow-400">{lead.course}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="relative -mt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Dados Pessoais */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl"><User className="w-6 h-6 text-[#0b3b75]" /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
                    <p className="text-sm text-gray-500">Preencha seus dados pessoais</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                    <input name="birthDate" value={form.birthDate} onChange={handleChange} placeholder="DD/MM/AAAA"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                    <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                    <input name="rg" value={form.rg} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                    <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]">
                      <option value="">Selecione</option>
                      {estadosCivis.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl"><MapPin className="w-6 h-6 text-green-700" /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Endereço</h2>
                    <p className="text-sm text-gray-500">Informe seu endereço completo</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <div className="relative">
                      <input name="cep" value={form.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="00000-000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                      {loadingCep && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                    <input name="street" value={form.street} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input name="number" value={form.number} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    <input name="neighborhood" value={form.neighborhood} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input name="city" value={form.city} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select name="state" value={form.state} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]">
                      <option value="">Selecione</option>
                      {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl"><CreditCard className="w-6 h-6 text-purple-700" /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Forma de Pagamento</h2>
                    <p className="text-sm text-gray-500">Escolha como deseja pagar</p>
                  </div>
                </div>

                {lead.courseValue && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <span className="text-sm text-blue-700 font-medium">Valor do curso:</span>
                    <span className="text-lg font-bold text-blue-900">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(lead.courseValue)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento *</label>
                    <select name="paymentMethodId" value={form.paymentMethodId} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]">
                      <option value="">Selecione</option>
                      {paymentMethods.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.name} {pm.type === "pix" ? "(PIX)" : pm.type === "credit" ? "(Crédito)" : "(Débito)"}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedPM && maxInstallments > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                      <select name="installments" value={form.installments} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3b75]/20 focus:border-[#0b3b75]">
                        {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={String(n)}>
                            {n}x {lead.courseValue ? `de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(lead.courseValue / n)}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#0b3b75] to-[#1e40af] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processando...</>
                ) : (
                  <><GraduationCap className="h-5 w-5" /> Finalizar Matrícula</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
