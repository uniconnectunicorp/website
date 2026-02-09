'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Users,
  Award,
  BookOpen,
  Instagram
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AlertCircle } from 'lucide-react';
import Head from '@/components/layout/Head';
import { handleWhatsappClick } from '@/components/layout/Whatsapp';
import { useSendLead } from '@/hooks/useSendLead';
import { useRouter } from 'next/navigation';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
});

export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { mutate: sendLead, isPending: isSending } = useSendLead({
    onSuccess: () => {
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      reset();
      router.push('/obrigado');
    },
    onError: () => {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    },
  });

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = form;

  // Observa mudanças no formulário
  const watchFields = watch();
  const isFormValid = !Object.keys(errors).length &&
    watchFields.name &&
    watchFields.email &&
    watchFields.subject &&
    watchFields.message;

  // Função para formatar telefone
  const formatPhone = (value) => {
    if (!value) return '';
    let numbers = value.replace(/\D/g, '');

    // Limita o tamanho (DDD + 9 dígitos)
    numbers = numbers.substring(0, 11);

    // Aplica a máscara: (00) 00000-0000
    return numbers
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhone(e.target.value);
    setValue('phone', formattedValue, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    // Salva nome e telefone no localStorage para rastreamento no fallback do WhatsApp
    try {
      localStorage.setItem('lead_name', data.name);
      if (data.phone) localStorage.setItem('lead_phone', data.phone);
    } catch (e) {}

    sendLead({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      course: `Contato - ${data.subject}`,
      message: data.message,
      modality: 'Contato',
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Telefone',
      info: '(31) 98877-5149',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'E-mail',
      info: 'unicorpconnectead@gmail.com',
      link: 'mailto:unicorpconnectead@gmail.com'
    },
    {
      icon: <Instagram className="h-6 w-6" />,
      title: 'Instagram',
      info: '@uniconnect_oficial',
      link: 'https://www.instagram.com/uniconnect_oficial/'
    },

  ];

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-white" />,
      number: '5000+',
      label: 'Alunos Formados'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      number: '20+',
      label: 'Cursos Disponíveis'
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      number: '100%',
      label: 'Reconhecido MEC'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      number: '98%',
      label: 'Satisfação'
    }
  ];

  return (
    <div className="min-h-screen">
      <Head title="Uniconnect | Contato" description="Entre em contato conosco para obter mais informações sobre nossos cursos e serviços." />

      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0b3b75] to-[#0b3b75] text-white pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-14">
                Entre em <span className="text-[#ff6600]">Contato</span> Conosco
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Estamos aqui para esclarecer suas dúvidas e ajudar você a dar o próximo passo na sua carreira profissional.
              </p>
            </motion.div>

            {/* Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Podemos Ajudar?</h2>

          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-12">
            {/* Contact Form - Lado Esquerdo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-md:p-6 border border-gray-100 h-full flex flex-col"
            >
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Mail className="h-8 w-8 text-[#0b3b75] mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Envie um E-mail</h3>
                </div>
                <p className="text-gray-600">
                  Preencha o formulário abaixo e nossa equipe entrará em contato com você o mais breve possível.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        className={`py-6 text-base border-gray-300 focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent ${errors.name ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                          }`}
                        {...register('name')}
                      />
                      {errors.name && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className={`py-6 text-base border-gray-300 focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                          }`}
                        {...register('email')}
                      />
                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone com DDD
                    </label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="(00) 90000-0000"
                        className={`pl-10 py-6 text-base border-gray-300 focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent ${errors.phone ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                          }`}
                        {...register('phone', {
                          onChange: handlePhoneChange
                        })}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      {errors.phone && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all ${errors.subject ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                          }`}
                        {...register('subject')}
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="Informações sobre cursos">Informações sobre cursos</option>
                        <option value="Dúvidas sobre matrícula">Dúvidas sobre matrícula</option>
                        <option value="Suporte técnico">Suporte técnico</option>
                        <option value="Parcerias">Parcerias</option>
                        <option value="Outros">Outros</option>
                      </select>
                      {errors.subject && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex-1 flex flex-col">
                    <textarea
                      id="message"
                      className={`flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all resize-none min-h-[120px] ${errors.message ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                        }`}
                      placeholder="Descreva sua dúvida ou mensagem..."
                      {...register('message')}
                    />
                    {errors.message && (
                      <div className="absolute top-3 right-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSending || !isFormValid}
                  className={`w-full bg-[#0b3b75] hover:bg-[#094066] text-white py-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${(isSending || !isFormValid) ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                >
                  {isSending ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center max-md:text-xs">
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Mensagem
                    </div>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* WhatsApp e Contact Info - Lado Direito */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* WhatsApp CTA - Destaque Principal */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 max-md:p-6 text-white shadow-2xl">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-10 w-10 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">Fale no WhatsApp</h3>
                    <p className="text-green-100 text-sm">Resposta mais rápida!</p>
                  </div>
                </div>
                <p className="mb-6 text-green-100 text-lg max-md:text-sm">
                  Atendimento imediato para suas dúvidas sobre cursos, matrículas e certificações.
                </p>
                <button
                  onClick={handleWhatsappClick}
                  className="inline-flex cursor-pointer items-center max-md:text-xs bg-white text-green-600 max-md:px-4 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full justify-center"
                >
                  <MessageSquare className="h-6 w-6 mr-3" />
                  Iniciar Conversa no WhatsApp
                </button>
                <p className="text-center text-green-100 text-sm mt-4">
                  Atendimento: Segunda a Sexta, 8h às 18h
                </p>
              </div>

              {/* Informações de Contato */}
              <div className="bg-white rounded-2xl shadow-xl p-8 max-md:p-6 border border-gray-100">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Outros Canais</h3>
                  <p className="text-gray-600">
                    Você também pode nos encontrar através destes canais:
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-[#0b3b75] rounded-lg flex items-center justify-center text-white mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-[#0b3b75] max-md:text-xs hover:text-[#094066] transition-colors font-medium"
                          >
                            {item.info}
                          </a>
                        ) : (
                          <p onClick={handleWhatsappClick} className="cursor-pointer text-[#0b3b75] max-md:text-xs hover:text-[#094066] transition-colors font-medium"
                          >{item.info}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}