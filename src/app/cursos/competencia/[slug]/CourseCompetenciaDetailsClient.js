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
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import { EnrollmentFormV2 } from '@/components/forms/EnrollmentFormV2';
import SistecAndMec from '@/components/sections/sistecAndMec';
import { Header } from '@/components/layout/Header';
import CTASection from '@/components/home/CTASection';
import { CourseFAQ } from '@/components/course-details/faq';
import AboutUsCourse from '@/components/course-details/AboutUs';
import { toast } from 'react-toastify';
import { BsFillCheckCircleFill } from "react-icons/bs";



export function CourseCompetenciaDetailsClient({ course }) {
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
  const originalPrice = formatPrice(course.originalPrice);

  return (
    <div className="min-h-screen overflow-x-hidden">
        <Header />
      {/* Cabeçalho do curso */}
      <div className="relative bg-[#0b3b75] pt-20 text-white overflow-hidden">
        {/* Efeitos visuais de fundo */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Conteúdo principal (esquerda) */}
            <div className="lg:col-span-7 relative z-10">
              <div className="mb-8">
                <div className="flex max-md:flex-col max-md:items-start items-center gap-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm text-blue-100 border border-white/20">
                  <Award className="h-4 w-4 mr-2" />
                  Diploma em 5 dias úteis
                </span>
                <span className="inline-flex items-center px-4 py-1.5 bg-[#ff6600] rounded-full text-sm font-semibold text-white">
                  Competência
                </span>
                </div>
                <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {course.nome}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-blue-100">
                  Valide seus conhecimentos e experiência profissional e obtenha seu diploma técnico 
                  de forma rápida. Com reconhecimento pelo MEC e registro no SISTEC, 
                  você conquista sua certificação com validade nacional.
                </p>
                
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-blue-200">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Diploma em 5 dias úteis</span>
                  </div>
                  
                  <div className="flex items-center text-blue-200">
                    <Monitor className="h-5 w-5 mr-2" />
                    <span>100% EAD</span>
                  </div>

                  <div className="flex items-center text-blue-200">
                    <BsFillCheckCircleFill className="h-5 w-5 mr-2" />
                    <span>Reconhecido MEC e SISTEC</span>
                  </div>
                </div>

                {/* Lista de benefícios */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Benefícios do Curso</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Diploma em 5 dias úteis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Reconhecido pelo MEC e registrado no SISTEC</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Para quem possui mais de 2 anos de experiência profissional na área</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Validação de conhecimentos prévios</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Certificação com validade nacional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card de investimento (direita) */}
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:sticky lg:top-6">
                <h3 className="text-2xl font-bold text-white mb-6">Investimento</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col items-baseline">
                    <span className="text-blue-200 line-through">
                      De {originalPrice}
                    </span>
                   <div className='flex w-full justify-between'>
                   <span className="text-4xl font-bold text-white">{currentPrice} <span className='font-normal text-sm text-gray-200'>à vista</span></span>
                   <p className='text-sm text-white bg-[#ff6600] px-4 flex items-center justify-center rounded-full'>40% de Desconto</p>
                   </div>
                  </div>
                  
                  <p className="text-blue-100 text-lg">
                    ou 12x de R$ 109,90 no Cartão de Crédito
                  </p>
                  
                  {/* Formulário de Matrícula Direto */}
                  <div className="">
                    <h4 className="text-white text-xl font-bold mb-4 text-center">Garanta sua vaga agora mesmo</h4>
                    <p className="text-blue-100 text-sm text-center mb-4">Preencha os dados abaixo e dê o primeiro passo na sua jornada profissional</p>
                    <EnrollmentFormV2 
                      courseName={course.nome}
                      courseTitle={course.nome}
                      coursePrice={course.price}
                      aproveitamento={false}
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

      {/* Seção de benefícios */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-3">POR QUE ESCOLHER NOSSO CURSO?</span>
            <h2 className="text-4xl font-bold text-gray-900">Diploma rápido com reconhecimento nacional</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-10 w-10 text-[#0b3b75]" />,
                title: "Diploma em 5 Dias",
                description: "Processo ágil e eficiente. Receba seu diploma técnico em até 5 dias úteis após a conclusão."
              },
              {
                icon: <Award className="h-10 w-10 text-[#0b3b75]" />,
                title: "Reconhecido pelo MEC",
                description: "Diploma com validade nacional, reconhecido pelo Ministério da Educação e registrado no SISTEC."
              },
              {
                icon: <Monitor className="h-10 w-10 text-[#0b3b75]" />,
                title: "Experiência Profissional",
                description: "Para quem possui mais de 2 anos de experiência profissional na área."
              },
              {
                icon: <Target className="h-10 w-10 text-[#0b3b75]" />,
                title: "Validação de Experiência",
                description: "Seus conhecimentos e experiência profissional são validados através de avaliação por competência."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-blue-100"
              >
                <div className="h-16 w-16 flex items-center justify-center bg-blue-50 rounded-xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#ff6600] bg-orange-100 rounded-full mb-3">PASSO A PASSO</span>
            <h2 className="text-4xl font-bold text-gray-900">Como funciona?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Comprovação', description: 'Envio de documentação que comprove experiência profissional.' },
              { step: '2', title: 'Matrícula', description: 'Após a aprovação da documentação é realizada a matrícula.' },
              { step: '3', title: 'Emissão', description: 'Após a matrícula é aguardado um prazo de 5 dias úteis para emissão do diploma.' },
              { step: '4', title: 'Diploma', description: 'Receba seu diploma em 5 dias úteis e seja um técnico.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#0b3b75] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CourseFAQ type="competencia" />

      <SistecAndMec />

      <AboutUsCourse />

      <CTASection courseName={course.nome} aproveitamento={false} />

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
                Sua matrícula foi realizada com sucesso. Em breve você receberá um e-mail com os detalhes de acesso ao curso.
              </p>
            </div>
          ) : (
            <EnrollmentFormV2
              courseName={course.nome}
              courseTitle={course.nome}
              coursePrice={course.price}
              aproveitamento={false}
              onSuccess={handleEnrollmentSuccess}
              onClose={() => setIsEnrollmentModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
