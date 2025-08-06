'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
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
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Telefone',
      info: '(31) 98877-5149',
      link: 'tel:+5531988775149'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'E-mail',
      info: 'contato@uniconnect.com.br',
      link: 'mailto:contato@uniconnect.com.br'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Endereço',
      info: 'Belo Horizonte, MG',
      link: null
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Horário de Atendimento',
      info: 'Segunda a Sexta: 8h às 18h',
      link: null
    }
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Entre em <span className="text-yellow-400">Contato</span> Conosco
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Estamos aqui para esclarecer suas dúvidas e ajudar você a dar o próximo passo na sua carreira profissional.
              </p>
            </motion.div>

            {/* Stats */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Podemos Ajudar?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Escolha a forma mais conveniente para entrar em contato conosco. Estamos prontos para esclarecer suas dúvidas!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form - Lado Esquerdo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Informações sobre cursos">Informações sobre cursos</option>
                      <option value="Dúvidas sobre matrícula">Dúvidas sobre matrícula</option>
                      <option value="Suporte técnico">Suporte técnico</option>
                      <option value="Parcerias">Parcerias</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent transition-all resize-none"
                    placeholder="Descreva sua dúvida ou mensagem..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0b3b75] hover:bg-[#094066] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
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
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-10 w-10 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">Fale no WhatsApp</h3>
                    <p className="text-green-100 text-sm">Resposta mais rápida!</p>
                  </div>
                </div>
                <p className="mb-6 text-green-100 text-lg">
                  🚀 Atendimento imediato para suas dúvidas sobre cursos, matrículas e certificações.
                </p>
                <a
                  href="https://wa.me/5531988775149?text=Olá! Gostaria de saber mais informações sobre os cursos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full justify-center"
                >
                  <MessageSquare className="h-6 w-6 mr-3" />
                  Iniciar Conversa no WhatsApp
                </a>
                <p className="text-center text-green-100 text-sm mt-4">
                  🕰️ Atendimento: Segunda a Sexta, 8h às 18h
                </p>
              </div>

              {/* Informações de Contato */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                            className="text-[#0b3b75] hover:text-[#094066] transition-colors font-medium"
                          >
                            {item.info}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.info}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-[#0b3b75] mr-3" />
                  <h4 className="font-bold text-gray-900">Horário de Atendimento</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Segunda a Sexta:</span>
                    <span className="font-semibold text-gray-900">8h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fins de semana:</span>
                    <span className="font-semibold text-gray-900">Fechado</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600">
              Confira as respostas para as dúvidas mais comuns sobre nossos cursos.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'Como funciona a matrícula nos cursos?',
                answer: 'A matrícula é 100% online. Após o pagamento, você recebe imediatamente o acesso à plataforma de estudos com todo o material do curso.'
              },
              {
                question: 'Os certificados são reconhecidos pelo MEC?',
                answer: 'Sim! Todos os nossos cursos técnicos são reconhecidos pelo MEC e registrados no SISTEC, garantindo validade nacional.'
              },
              {
                question: 'Qual a diferença entre curso regular e por competência?',
                answer: 'O curso regular tem duração de 6-12 meses com metodologia estruturada. O por competência é mais rápido (45 dias) e ideal para quem já tem experiência na área.'
              },
              {
                question: 'Posso estudar no meu próprio ritmo?',
                answer: 'Sim! Nossos cursos são 100% EAD, permitindo que você estude quando e onde quiser, no seu próprio ritmo.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}