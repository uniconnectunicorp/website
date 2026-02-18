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
  Globe,
  Headphones,
  MessageCircle,
  Briefcase,
} from 'lucide-react';
import { EnrollmentFormV2 } from '@/components/forms/EnrollmentFormV2';
import SistecAndMec from '@/components/sections/sistecAndMec';
import { Header } from '@/components/layout/Header';
import CTASection from '@/components/home/CTASection';
import AboutUsCourse from '@/components/course-details/AboutUs';
import Head from '@/components/layout/Head';
import InglesPopup from './_components/InglesPopup';

const course = {
  nome: "Curso de Inglês",
  slug: "curso-de-ingles",
  price: 398.90,
  originalPrice: 665.90,
  installment: 39.90,
  installments: 12,
  modality: "EaD",
  description: "O Curso de Inglês é a oportunidade perfeita para quem deseja aprender ou aprimorar o idioma mais falado no mundo dos negócios. Com metodologia prática e 100% online, você desenvolve habilidades de leitura, escrita, conversação e compreensão auditiva no seu próprio ritmo.",
  image: "/courses/informatica.webp",
  highlights: [
    "Inglês do Básico ao Avançado",
    "Conversação e Pronúncia",
    "Gramática e Vocabulário",
    "Inglês para Negócios",
    "Compreensão Auditiva",
    "Certificado de Conclusão"
  ]
};

export default function CursoDeInglesPage() {
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
      <Head title="Curso de Inglês | Uniconnect" image={course.image} description="Aprenda inglês 100% online, do básico ao avançado. Certificado de conclusão incluso. Estude no seu ritmo." />
      <div className="min-h-screen overflow-x-hidden">
        
        {/* Hero */}
        <div className="relative bg-[#0b3b75] pt-20 text-white overflow-hidden">
          <div className="absolute max-md:hidden inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute max-md:hidden -top-32 -right-32 w-64 h-64 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute max-md:hidden -bottom-32 -left-32 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
            <Header />
            <div className="lg:grid lg:grid-cols-12 grid-cols-1 lg:gap-8">
              {/* Conteúdo principal */}
              <div className="lg:col-span-7 relative z-10">
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-sky-500/20 to-blue-500/20 backdrop-blur-sm text-sky-300 border border-sky-400/30">
                      <Globe className="w-4 h-4 mr-2" />
                      Idiomas
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
                          <p className="text-blue-100 text-sm text-center mb-4 max-md:hidden">Preencha os dados abaixo e comece a aprender inglês hoje</p>
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
                    <h3 className="text-xl font-semibold text-white">Por que aprender inglês?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Melhores oportunidades de emprego</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">100% Online (EaD)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Do básico ao avançado</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Certificado de conclusão</span>
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
                      <Globe className="h-5 w-5 mr-2" />
                      <span>Do Básico ao Avançado</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <Monitor className="h-5 w-5 mr-2" />
                      <span>Modalidade {course.modality}</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <Award className="h-5 w-5 mr-2" />
                      <span>Certificado Incluso</span>
                    </div>
                  </div>

                  {/* Desktop benefits */}
                  <div className="mt-8 space-y-4 max-md:hidden">
                    <h3 className="text-xl font-semibold text-white">Por que aprender inglês?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Melhores oportunidades de emprego e salários mais altos</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">100% Online — estude de qualquer lugar</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Do básico ao avançado, no seu ritmo</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-blue-100">Certificado de conclusão incluso</span>
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
                      <p className="text-blue-100 text-sm text-center mb-4">Preencha os dados abaixo e comece a aprender inglês hoje</p>
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
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-sky-700 bg-sky-100 rounded-full mb-3">POR QUE APRENDER INGLÊS?</span>
              <h2 className="text-4xl font-bold text-gray-900">O inglês abre portas para o mundo</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: <Globe className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Idioma Universal",
                  description: "O inglês é o idioma mais utilizado no mundo dos negócios, tecnologia e comunicação internacional."
                },
                {
                  icon: <Briefcase className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Carreira Profissional",
                  description: "Profissionais que falam inglês têm acesso a melhores vagas e salários significativamente maiores."
                },
                {
                  icon: <Headphones className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Metodologia Prática",
                  description: "Aprenda com videoaulas, exercícios interativos e conteúdos que simulam situações reais do dia a dia."
                },
                {
                  icon: <MessageCircle className="h-10 w-10 text-[#0b3b75]" />,
                  title: "Conversação Real",
                  description: "Desenvolva habilidades de conversação, pronúncia e compreensão auditiva de forma natural e progressiva."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-sky-100 w-full"
                >
                  <div className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center bg-sky-50 rounded-xl mb-4 flex-shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* O que você vai aprender */}
        {course.highlights && course.highlights.length > 0 && (
          <div className="py-16 bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-3">O QUE VOCÊ VAI APRENDER</span>
                <h2 className="text-4xl font-bold text-gray-900">Conteúdo do Curso</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  Uma formação completa para você dominar o inglês
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {course.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-sky-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0b3b75] to-[#0d4d99] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{highlight}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Investimento CTA */}
        <div className="py-16 bg-gradient-to-r from-[#0b3b75] to-[#0d4d99] text-white overflow-x-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span className="text-sm font-semibold text-sky-200">Melhor Custo-Benefício</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Aprenda inglês por um preço acessível</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Invista no idioma que mais abre portas no mundo
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
                  <span className="text-blue-100">Do básico ao avançado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">Certificado de conclusão</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">Suporte completo durante o curso</span>
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
        <InglesFAQ />

        <SistecAndMec />
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

        <InglesPopup />
      </div>
    </>
  );
}


function InglesFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'Preciso ter algum conhecimento prévio de inglês?',
      answer: 'Não! O curso começa do nível básico e vai até o avançado. É perfeito tanto para quem nunca estudou inglês quanto para quem deseja aprimorar seus conhecimentos.'
    },
    {
      question: 'O curso é totalmente online?',
      answer: 'Sim, o curso é 100% online (EaD). Você pode estudar de qualquer lugar, a qualquer hora, usando computador, tablet ou celular.'
    },
    {
      question: 'Recebo certificado ao concluir?',
      answer: 'Sim! Ao concluir o curso, você recebe um certificado de conclusão que pode ser utilizado para comprovar seus conhecimentos no idioma.'
    },
    {
      question: 'Quanto tempo tenho para concluir o curso?',
      answer: 'Você estuda no seu próprio ritmo. Não há prazo fixo para conclusão, permitindo que você se adapte à sua rotina de estudos.'
    },
    {
      question: 'Como funciona o pagamento?',
      answer: 'Você pode pagar à vista por R$398,90 ou parcelar em até 12x de R$39,90 no cartão de crédito. Entre em contato para conhecer outras condições especiais.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Perguntas Frequentes
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Tire suas dúvidas sobre o Curso de Inglês.
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
