'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Monitor,
  Award,
  ArrowRight,
  Sparkles,
  GraduationCap,
  FileText,
  Target,
  Heart,
  Briefcase,
} from 'lucide-react';
import { EnrollmentFormV2 } from '@/components/forms/EnrollmentFormV2';
import { Header } from '@/components/layout/Header';
import CTASection from '@/components/home/CTASection';
import AboutUsCourse from '@/components/course-details/AboutUs';
import Head from '@/components/layout/Head';
import EjaPopup from './_components/EjaPopup';

const course = {
  nome: "EJA - Educação de Jovens e Adultos",
  slug: "eja",
  price: 999.90,
  originalPrice: 1665.90,
  installment: 91.90,
  installments: 12,
  modality: "EaD",
  description: "A EJA (Educação de Jovens e Adultos) é a oportunidade ideal para quem deseja concluir o Ensino Médio de forma rápida e flexível. Com cadastro na Secretaria da Educação, a EJA permite que você conquiste seu diploma e abra novas portas no mercado de trabalho e na vida acadêmica.",
  image: "/courses/secretaria-escolar.webp",
  highlights: [
    "Conclusão do Ensino Médio",
    "Cadastro na Secretaria da Educação",
    "Estude no Seu Ritmo",
    "Acesso Imediato"
  ]
};

export default function EjaPage() {
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const handleEnrollmentSuccess = () => {
    setEnrollmentSuccess(true);
    setTimeout(() => {
      setIsEnrollmentModalOpen(false);
      setEnrollmentSuccess(false);
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const currentPrice = formatPrice(course.price);

  return (
    <>
      <Head title="EJA - Educação de Jovens e Adultos | Uniconnect" image={course.image} description="Conclua o Ensino Médio com a EJA. Cadastro na Secretaria da Educação. Estude no seu ritmo." />
      <div className="min-h-screen overflow-x-hidden">
        
        {/* Hero */}
        <div className="relative bg-[#0b3b75] pt-20 text-white overflow-hidden">
          <div className="absolute max-md:hidden inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute max-md:hidden -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute max-md:hidden -bottom-32 -left-32 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
            <Header />
            <div className="lg:grid lg:grid-cols-12 grid-cols-1 lg:gap-8">
              {/* Conteúdo principal */}
              <div className="lg:col-span-7 relative z-10">
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm text-purple-300 border border-purple-400/30">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      EJA
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm text-blue-100 border border-white/20">
                      <Monitor className="w-4 h-4 mr-2" />
                      100% Online
                    </span>
                  </div>
                  <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {course.nome}
                  </h1>

                  {/* Mobile investment card */}
                  <div className="lg:col-span-5 mt-4 lg:mt-0 md:hidden">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:sticky lg:top-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Investimento</h3>
                        <span className='text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 rounded-full font-bold'>40% OFF</span>
                      </div>
                      <div className="space-y-6 max-md:space-y-3">
                        <div className="flex flex-col items-baseline">
                          <div className='flex w-full justify-between'>
                            <div className="flex flex-col">
                              <span className="text-sm line-through text-gray-300">De {formatPrice(course.originalPrice)}</span>
                              <span className="text-4xl font-bold text-white max-md:text-2xl">{currentPrice} <br className='md:hidden'/> <span className='font-normal text-sm text-gray-200'>à vista</span></span>
                            </div>
                          </div>
                        </div>
                        <p className="text-blue-100 text-lg max-md:text-sm">
                          ou {course.installments}x de {formatPrice(course.installment)} no cartão de Crédito
                        </p>
                        <div className="">
                          <h4 className="text-white text-xl font-bold mb-4 max-md:text-base text-center">Garanta sua vaga agora mesmo</h4>
                          <p className="text-blue-100 text-sm text-center mb-4 max-md:hidden">Preencha os dados abaixo e dê o primeiro passo para concluir seus estudos</p>
                          <EnrollmentFormV2 
                            courseName={course.nome}
                            courseTitle={course.nome}
                            coursePrice={course.price}
                            competency={false}
                            onSuccess={handleEnrollmentSuccess}
                            compact={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile benefits */}
                  <div className="mt-8 space-y-4 md:hidden">
                    <h3 className="text-xl font-semibold text-white">Por que escolher a EJA?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Cadastro na Secretaria da Educação</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Estude no seu ritmo</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Diploma válido em todo o Brasil</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Acesso imediato após a matrícula</span>
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4 text-lg md:text-xl text-blue-100">
                    {course.description}
                  </p>
                  
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center text-blue-200">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      <span>Ensino Médio</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <Award className="h-5 w-5 mr-2" />
                      <span>Cadastro na Secretaria da Educação</span>
                    </div>
                  </div>

                  {/* Desktop benefits */}
                  <div className="mt-8 space-y-4 max-md:hidden">
                    <h3 className="text-xl font-semibold text-white">Por que escolher a EJA?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Cadastro na Secretaria da Educação</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Estude no seu ritmo, sem sair de casa</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Diploma válido em todo o Brasil</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Acesso imediato após a matrícula</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card de investimento - Desktop */}
              <div className="lg:col-span-5 mt-10 lg:mt-0 max-md:hidden">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:sticky lg:top-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Investimento</h3>
                    <span className='text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 rounded-full font-bold'>40% OFF</span>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col items-baseline">
                      <div className='flex w-full justify-between'>
                        <div className="flex flex-col">
                          <span className="text-sm line-through text-gray-300">De {formatPrice(course.originalPrice)}</span>
                          <span className="text-4xl font-bold text-white">{currentPrice} <span className='font-normal text-sm text-gray-200'>à vista</span></span>
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-100 text-lg">
                      ou {course.installments}x de {formatPrice(course.installment)} no cartão de Crédito
                    </p>
                    <div className="">
                      <h4 className="text-white text-xl font-bold mb-4 text-center">Garanta sua vaga agora mesmo</h4>
                      <p className="text-blue-100 text-sm text-center mb-4">Preencha os dados abaixo e dê o primeiro passo para concluir seus estudos</p>
                      <EnrollmentFormV2 
                        courseName={course.nome}
                        courseTitle={course.nome}
                        coursePrice={course.price}
                        competency={false}
                        onSuccess={handleEnrollmentSuccess}
                        compact={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full mb-3">POR QUE ESCOLHER A EJA?</span>
              <h2 className="text-4xl font-bold text-gray-900">Conquiste seu diploma e transforme sua vida</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <GraduationCap className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Diploma Reconhecido",
                  description: "Certificado válido em todo o território nacional, com cadastro na Secretaria da Educação."
                },
                {
                  icon: <Clock className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Estude no Seu Ritmo",
                  description: "Sem horários fixos. Você define quando e onde estudar, adaptando os estudos à sua rotina."
                },
                {
                  icon: <Briefcase className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Novas Oportunidades",
                  description: "Abra portas para concursos públicos, melhores empregos e continuidade nos estudos."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-purple-100 w-full"
                >
                  <div className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center bg-purple-50 rounded-xl mb-4 flex-shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Para quem é o EJA */}
        <div className="py-16 bg-white overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-3">PARA QUEM É A EJA?</span>
              <h2 className="text-4xl font-bold text-gray-900">A EJA é ideal para você que</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Não importa a idade ou o motivo — o importante é dar o próximo passo
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                "Não concluiu o Ensino Médio",
                "Precisa do diploma para o trabalho",
                "Quer prestar concursos públicos",
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0b3b75] to-[#0d4d99] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{item}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
              {[
                "Deseja ingressar na faculdade",
                "Busca crescimento pessoal e profissional"
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0b3b75] to-[#0d4d99] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{item}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investimento CTA */}
        <div className="py-16 bg-gradient-to-r from-[#0b3b75] to-[#0d4d99] text-white overflow-x-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-semibold text-purple-200">Investimento Acessível</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Invista no seu futuro</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Conclua seus estudos com cadastro na Secretaria da Educação
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 max-w-lg mx-auto">
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold mb-4">40% OFF</div>
              <div className="mb-2">
                <span className="text-lg line-through text-blue-300">De {formatPrice(course.originalPrice)}</span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold">{currentPrice}</span>
                <span className="text-lg text-blue-200 ml-2">à vista</span>
              </div>
              <div className="w-full h-px bg-white/20 mb-6"></div>
              <p className="text-lg text-blue-100 mb-6">
                ou <span className="font-bold text-white">{course.installments}x de {formatPrice(course.installment)}</span> no cartão de crédito
              </p>
              <div className="space-y-3 text-left mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">Acesso imediato à plataforma</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">Cadastro na Secretaria da Educação</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">Suporte completo durante os estudos</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">Estude no seu ritmo</span>
                </div>
              </div>
              <Button
                onClick={() => setIsEnrollmentModalOpen(true)}
                className="w-full px-8 py-4 text-base font-medium rounded-xl bg-white text-[#0b3b75] hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105 cursor-pointer"
              >
                Quero me matricular agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <EjaFAQ />

        <AboutUsCourse />
        <CTASection courseName={course.nome} />

        {/* Modal de Matrícula */}
        <Dialog open={isEnrollmentModalOpen} onOpenChange={setIsEnrollmentModalOpen}>
          <DialogTitle></DialogTitle>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl bg-white">
            {enrollmentSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Parabéns!</h3>
                <p className="mt-2 text-gray-600">
                  Sua matrícula foi realizada com sucesso. Em breve você receberá um e-mail com os detalhes de acesso.
                </p>
              </div>
            ) : (
              <EnrollmentFormV2
                courseName={course.nome}
                courseTitle={course.nome}
                coursePrice={course.price}
                onSuccess={handleEnrollmentSuccess}
                onClose={() => setIsEnrollmentModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <EjaPopup />
      </div>
    </>
  );
}


function EjaFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'O que é a EJA?',
      answer: 'A EJA (Educação de Jovens e Adultos) é um programa educacional destinado a pessoas que não concluíram o Ensino Médio na idade regular. Ela permite que jovens e adultos obtenham seu diploma de forma acelerada e flexível.'
    },
    {
      question: 'O diploma da EJA é reconhecido?',
      answer: 'Sim! O diploma da EJA possui cadastro na Secretaria da Educação e tem a mesma validade de um diploma obtido no ensino regular. É aceito em concursos públicos, faculdades e no mercado de trabalho.'
    },
    {
      question: 'Como funciona a EJA?',
      answer: 'A EJA é um programa flexível que permite concluir o Ensino Médio no seu ritmo. Você estuda com material didático completo e conta com suporte durante todo o processo.'
    },
    {
      question: 'Qual a idade mínima para fazer a EJA?',
      answer: 'Para o Ensino Médio, a idade mínima é de 18 anos.'
    },
    {
      question: 'Como funciona o pagamento?',
      answer: 'Você pode pagar à vista por R$999,90 ou parcelar em até 12x de R$91,90 no cartão de crédito. Entre em contato para conhecer outras condições especiais.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Perguntas Frequentes
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Tire suas dúvidas sobre a EJA.
        </p>
      </div>
      <div className="mt-8">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg ${
              openIndex === index ? 'bg-[#0b3b75] text-white' : 'bg-white'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex justify-between items-center cursor-pointer p-6 w-full text-left"
            >
              <h3 className={`text-lg font-semibold ${openIndex === index ? 'text-white' : 'text-gray-800'}`}>
                {item.question}
              </h3>
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-white' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-gray-100">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
