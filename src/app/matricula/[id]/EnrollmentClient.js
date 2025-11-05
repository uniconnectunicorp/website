'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from 'next/link';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  BookOpen,
  Calendar,
  FileText,
  Home,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchCourses } from '@/data/course';
import { Header } from '@/components/layout/Header';

export default function EnrollmentClient({ seller }) {
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const courses = fetchCourses();
  
  const [formData, setFormData] = useState({
    // Dados Pessoais
    fullName: '',
    birthDate: '',
    cpf: '',
    rg: '',
    maritalStatus: '',
    phone: '',
    email: '',
    
    // Endereço
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    
    // Curso
    courseName: '',
    paymentMethod: ''
  });

  const estadosCivis = [
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' },
    { value: 'viuvo', label: 'Viúvo(a)' },
    { value: 'uniao-estavel', label: 'União Estável' }
  ];

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const paymentMethods = [
    { value: 'pix', label: 'PIX' },
    // { value: 'boleto', label: 'Boleto Bancário' },
    { value: 'cartao-credito', label: 'Cartão de Crédito' },
  ];

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
        
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
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
    setLoading(true);

    try {
      const response = await fetch('/api/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          seller: seller.name,
          sellerId: seller.id
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

  // Funções de máscara
  const maskDate = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    // Aplicar máscaras específicas
    if (name === 'birthDate') {
      maskedValue = maskDate(value);
    } else if (name === 'cpf') {
      maskedValue = maskCPF(value);
    } else if (name === 'phone') {
      maskedValue = maskPhone(value);
    } else if (name === 'cep') {
      maskedValue = maskCEP(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: maskedValue
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0b3b75] via-[#0b3b75] to-[#0b3b75] pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
              Você está a poucos passos de transformar sua carreira profissional!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <User className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">
                Atendente responsável: <span className="font-bold text-yellow-400">{seller.name}</span>
              </span>
            </div>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="text"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      maxLength="14"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      RG *
                    </label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="00.000.000-0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado Civil *
                    </label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Selecione</option>
                      {estadosCivis.map(estado => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength="15"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        onBlur={handleCepBlur}
                        required
                        maxLength="9"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                        placeholder="00000-000"
                      />
                      {loadingCep && (
                        <Loader2 className="absolute right-3 top-3.5 w-5 h-5 text-[#0b3b75] animate-spin" />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Selecione</option>
                      {estados.map(estado => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rua *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="Nome da rua"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="Nº"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="Bairro"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="Cidade"
                    />
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome do Curso *
                    </label>
                    <select
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Selecione um curso</option>
                      {courses.map(course => (
                        <option key={course.slug} value={course.nome}>
                          {course.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Forma de Pagamento *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Selecione</option>
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
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
                      Finalizar Matrícula
                    </>
                  )}
                </button>
                
              </div>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Parabéns!
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Parabéns pela sua matrícula, enviaremos o link de pagamento e logo após o pagamento você já poderá acessar o seu portal do aluno.
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
