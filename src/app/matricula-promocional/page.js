'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  BookOpen,
  CheckCircle,
  Loader2,
  Tag,
  Lock,
  Unlock,
  Percent,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAllCoursesForEnrollment } from '@/data/course';
import { Header } from '@/components/layout/Header';

const PROMO_CODE = 'uni2026tec';

export default function MatriculaPromocional() {
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [promoShake, setPromoShake] = useState(false);
  const courses = fetchAllCoursesForEnrollment();

  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    cpf: '',
    rg: '',
    maritalStatus: '',
    phone: '',
    email: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    courseName: '',
    paymentMethod: '',
  });

  const estadosCivis = [
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' },
    { value: 'viuvo', label: 'Viúvo(a)' },
    { value: 'uniao-estavel', label: 'União Estável' },
  ];

  const estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
    'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
    'RS','RO','RR','SC','SP','SE','TO',
  ];

  const paymentMethods = [
    { value: 'pix', label: 'PIX' },
    { value: 'cartao-credito', label: 'Cartão de Crédito' },
  ];

  const handlePromoSubmit = () => {
    if (promoCode.toLowerCase().trim() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError(false);
      toast.success('Cupom aplicado com sucesso! 50% de desconto ativado!');
    } else {
      setPromoError(true);
      setPromoShake(true);
      setTimeout(() => setPromoShake(false), 600);
      toast.error('Código promocional inválido. Tente novamente.');
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) {
          toast.error('CEP não encontrado. Verifique e tente novamente.');
          return;
        }
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
        toast.success('Endereço encontrado!');
      } catch (error) {
        toast.error('Erro ao buscar CEP. Tente novamente.');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promoApplied) {
      toast.error('Aplique o código promocional antes de finalizar.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          seller: 'Promocional 50%',
          sellerId: 'promo-50',
          promoCode: promoCode,
          discount: '50%',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        toast.error(data.message || 'Erro ao realizar matrícula. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const maskDate = (value) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');

  const maskCPF = (value) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

  const maskPhone = (value) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');

  const maskCEP = (value) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'birthDate') maskedValue = maskDate(value);
    else if (name === 'cpf') maskedValue = maskCPF(value);
    else if (name === 'phone') maskedValue = maskPhone(value);
    else if (name === 'cep') maskedValue = maskCEP(value);
    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const inputClass = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all bg-white border-gray-300 text-gray-900 focus:ring-[#0b3b75]';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0b3b75] via-[#0b3b75] to-[#0b3b75] pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-10 mb-4">
              Complete sua Matrícula
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
              Insira seu código promocional e garanta <span className="font-bold text-yellow-400">50% de desconto</span> no curso técnico dos seus sonhos!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative -mt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Código Promocional */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl transition-all duration-500 ${promoApplied ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {promoApplied ? (
                      <Unlock className="w-6 h-6 text-green-600" />
                    ) : (
                      <Lock className="w-6 h-6 text-[#0b3b75]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {promoApplied ? 'Cupom Ativado!' : 'Código Promocional'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {promoApplied
                        ? 'Desconto de 50% aplicado com sucesso'
                        : 'Digite o código para desbloquear o desconto e o formulário de matrícula'}
                    </p>
                  </div>
                </div>

                {!promoApplied ? (
                  <motion.div
                    animate={promoShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError(false);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePromoSubmit())}
                        placeholder="Digite o código aqui..."
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-lg tracking-wider font-mono ${
                          promoError
                            ? 'border-red-500 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-[#0b3b75]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handlePromoSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-[#0b3b75] to-[#1e40af] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <Tag className="w-5 h-5" />
                        Aplicar
                      </button>
                    </div>
                    {promoError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        Código inválido. Verifique e tente novamente.
                      </motion.p>
                    )}
                  </motion.div>
                ) : null}
              </div>

              {/* Pricing Display — sempre visível */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Valor do Curso</p>
                  {!promoApplied ? (
                    <p className="text-3xl font-bold text-[#0b3b75]">R$ 1.665,90</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-green-600">R$ 799,90 <span className="text-base font-normal text-gray-600">à vista</span></p>
                      <p className="text-gray-600 mt-1">ou 12x de R$ 74,90 no cartão</p>
                      <p className="text-sm text-gray-500 line-through mt-2">De R$ 1.665,90</p>
                      <p className="text-sm text-green-600 font-semibold mt-1">✓ Cupom promocional aplicado!</p>
                    </>
                  )}
                </div>
              </div>

              {/* Restante do formulário — só aparece após cupom */}
              {promoApplied && (
                <>
                  {/* Dados Pessoais */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <User className="w-6 h-6 text-[#0b3b75]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
                        <p className="text-sm text-gray-600">Preencha suas informações pessoais e após concluir será enviado o link de pagamento para você no WhatsApp.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Nome Completo *</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="Digite seu nome completo" />
                      </div>
                      <div>
                        <label className={labelClass}>Data de Nascimento *</label>
                        <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} required maxLength="10" className={inputClass} placeholder="DD/MM/AAAA" />
                      </div>
                      <div>
                        <label className={labelClass}>CPF *</label>
                        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required maxLength="14" className={inputClass} placeholder="000.000.000-00" />
                      </div>
                      <div>
                        <label className={labelClass}>RG *</label>
                        <input type="text" name="rg" value={formData.rg} onChange={handleChange} required className={inputClass} placeholder="00.000.000-0" />
                      </div>
                      <div>
                        <label className={labelClass}>Estado Civil *</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required className={inputClass}>
                          <option value="">Selecione</option>
                          {estadosCivis.map((ec) => (
                            <option key={ec.value} value={ec.value}>{ec.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Telefone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength="15" className={inputClass} placeholder="(00) 00000-0000" />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>E-mail *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="seu@email.com" />
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <MapPin className="w-6 h-6 text-[#ff6600]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Endereço</h2>
                        <p className="text-sm text-gray-600">Informações de localização</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>CEP *</label>
                        <div className="relative">
                          <input type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} required maxLength="9" className={inputClass} placeholder="00000-000" />
                          {loadingCep && (
                            <Loader2 className="absolute right-3 top-3.5 w-5 h-5 text-[#0b3b75] animate-spin" />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Estado *</label>
                        <select name="state" value={formData.state} onChange={handleChange} required className={inputClass}>
                          <option value="">Selecione</option>
                          {estados.map((uf) => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Rua *</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} required className={inputClass} placeholder="Nome da rua" />
                      </div>
                      <div>
                        <label className={labelClass}>Número *</label>
                        <input type="text" name="number" value={formData.number} onChange={handleChange} required className={inputClass} placeholder="Nº" />
                      </div>
                      <div>
                        <label className={labelClass}>Bairro *</label>
                        <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required className={inputClass} placeholder="Bairro" />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Cidade *</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required className={inputClass} placeholder="Cidade" />
                      </div>
                    </div>
                  </div>

                  {/* Curso */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Curso Escolhido</h2>
                        <p className="text-sm text-gray-600">Selecione o curso e forma de pagamento</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Nome do Curso *</label>
                        <select name="courseName" value={formData.courseName} onChange={handleChange} required className={inputClass}>
                          <option value="">Selecione um curso</option>
                          {['Técnico Regular', 'Aproveitamento', 'Competência', 'Sequencial', 'EJA', 'Inglês'].map(tipo => {
                            const group = courses.filter(c => c.tipo === tipo);
                            if (!group.length) return null;
                            return (
                              <optgroup key={tipo} label={tipo}>
                                {group.map(course => (
                                  <option key={course.slug} value={course.nome}>{course.nome}</option>
                                ))}
                              </optgroup>
                            );
                          })}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Forma de Pagamento *</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className={inputClass}>
                          <option value="">Selecione</option>
                          {paymentMethods.map((method) => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info Banner */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Percent className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-green-700 font-bold text-lg">Link de pagamento via WhatsApp</p>
                        <p className="text-gray-600 text-sm">Após finalizar, você receberá o link de pagamento com o desconto aplicado via WhatsApp.</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#0b3b75] to-[#1e40af] text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Finalizar Matrícula com 50% OFF
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Parabéns!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Parabéns pela sua matrícula com <span className="font-bold text-green-600">50% de desconto</span>! Enviaremos o link de pagamento e logo após o pagamento você já poderá acessar o seu portal do aluno.
                </p>
              </div>
              <Link
                href="/"
                className="w-full bg-gradient-to-r from-[#0b3b75] to-[#1e40af] text-white py-3 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 text-center block"
              >
                Confirmar
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
