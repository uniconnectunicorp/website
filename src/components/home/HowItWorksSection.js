'use client';

import { Search, FileText, UserCheck, MessageCircle, Award, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import FadeInUp from "@/components/client/FadeInUp";
import Link from 'next/link';

const courseTracks = [
  {
    title: 'Cursos Técnicos Regulares',
    icon: Award,
    color: 'bg-[#0b3b75]',
    href: '/cursos',
    duration: '6 meses (12 meses para Segurança do Trabalho)',
    features: [
      'Certificação reconhecida pelo MEC e Sistec',
      '100% EAD com flexibilidade total',
      'Emissão de credencial ao final do curso',
      '27 opções de cursos disponíveis',
      'Acesso a materiais exclusivos',
      'Suporte de professores especializados'
    ]
  },
  {
    title: 'Cursos por Competência',
    icon: Users,
    color: 'bg-[#ff6600]',
    href: '/cursos/competencia',
    duration: 'A partir de 45 dias',
    features: [
      'Reconhecimento pelo MEC e Sistec',
      '100% online e flexível',
      'Para profissionais com experiência',
      'Requer 2+ anos na área',
      'Currículo enxuto e objetivo',
      'Validação de conhecimentos prévios'
    ]
  }
];

const steps = [
  {
    title: 'Escolha seu curso',
    description: 'Selecione entre nossos cursos técnicos de alta qualidade, alinhados com as necessidades do mercado de trabalho.',
    icon: Search,
    color: 'bg-[#0b3b75]',
    features: [
      'Diversas áreas técnicas disponíveis',
      'Cursos atualizados com o mercado',
      'Grade curricular completa e prática'
    ]
  },
  {
    title: 'Faça sua matrícula',
    description: 'Processo 100% online, rápido e sem complicações. Comece em poucos minutos.',
    icon: FileText,
    color: 'bg-[#0b3b75]',
    features: [
      'Documentação 100% digital',
      'Diversas formas de pagamento',
      'Aprovação em até 24h'
    ]
  },
  {
    title: 'Acesse a plataforma',
    description: 'Tenha acesso imediato a todo o conteúdo do curso em nossa plataforma EAD.',
    icon: UserCheck,
    color: 'bg-[#0b3b75]',
    features: [
      'Aulas online e gravadas',
      'Materiais didáticos exclusivos',
      'Exercícios práticos e simulados'
    ]
  },
  {
    title: 'Certificação',
    description: 'Ao concluir, receba seu certificado reconhecido pelo MEC e pelo mercado.',
    icon: Award,
    color: 'bg-[#0b3b75]',
    features: [
      'Certificado digital com QR Code',
      'Válido em todo território nacional',
      'Aceito por empresas e concursos'
    ]
  }
];

const stats = [
  { value: '100%', label: 'Online', icon: <Clock className="h-6 w-6 text-[#ff6600]" /> },
  { value: '5k+', label: 'Alunos Formados', icon: <Users className="h-6 w-6 text-[#ff6600]" /> },
  { value: '98%', label: 'Aprovação', icon: <CheckCircle className="h-6 w-6 text-[#ff6600]" /> },
  { value: '24/7', label: 'Suporte', icon: <MessageCircle className="h-6 w-6 text-[#ff6600]" /> },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 bg-white">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <FadeInUp>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Inicie sua carreira.
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-gray-600">
              Uma jornada simples e objetiva para sua formação técnica de qualidade
            </p>
          </FadeInUp>
        </div>

        {/* Course Tracks */}
        <div className="max-w-5xl mx-auto mb-20">
          <FadeInUp>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">
              Escolha a modalidade que melhor se encaixa no seu perfil
            </h3>
          </FadeInUp>
          
          <div className="grid md:grid-cols-2 gap-8">
            {courseTracks.map((track, index) => (
              <FadeInUp key={index} delay={index * 0.1}>
                <div className="relative h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className={`h-2 ${track.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg ${track.color} bg-opacity-10 mr-4`}>
                        <track.icon className={`h-8 w-8 ${track.color} text-white`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{track.title}</h3>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Duração: {track.duration}</span>
                    </div>
                    
                    <ul className="space-y-3 mt-6">
                      {track.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link 
                        href={track.href}
                        className="inline-flex items-center text-sm font-medium text-[#0b3b75]"
                      >
                        Ver cursos disponíveis
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Progress bar */}
          <div className="hidden lg:flex absolute left-1/2 top-0 h-full -translate-x-1/2">
            <div className="h-full w-1 bg-gray-200">
              <div className="h-full w-full bg-[#ff6600]" style={{ height: '25%' }}></div>
            </div>
          </div>
          
          {/* <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => (
              <FadeInUp key={index} delay={index * 0.1} className="relative">
                <div className="lg:flex items-start gap-12">
                  <div className="lg:hidden mb-6 flex items-center">
                    <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full ${step.color} text-white text-xl font-bold`}>
                      {index + 1}
                    </div>
                    <h3 className="ml-4 text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  
                  <div className="lg:w-1/2 lg:py-8">
                    <div className="hidden lg:flex items-center mb-6">
                      <div className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full ${step.color} text-white text-2xl font-bold`}>
                        {index + 1}
                      </div>
                      <h3 className="ml-6 text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    
                    <p className="text-lg text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#ff6600] mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="hidden lg:block lg:w-1/2 mt-8 lg:mt-0">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <step.icon className={`h-16 w-16 ${step.color.replace('bg-', 'text-')} opacity-20`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div> */}
        </div>
        
        {/* Stats */}
        <div className="mt-24">
          <FadeInUp>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">
              Por que escolher nossos cursos?
            </h3>
          </FadeInUp>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-blue-50 rounded-2xl p-8">
            {stats.map((stat, index) => (
              <FadeInUp key={index} delay={0.5 + (index * 0.1)} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-[#0b3b75]">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
              </FadeInUp>
            ))}
          </div>
          
          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>Nossos cursos são reconhecidos pelo MEC e Sistec, garantindo qualidade e validade em todo território nacional.</p>
            <p className="mt-2">Dúvidas? <a href="#" className="text-[#0b3b75] hover:underline">Fale com nosso time</a></p>
          </div>
        </div>
        
        {/* CTA */}
        <FadeInUp delay={0.9} className="mt-16 text-center">
          <Link 
            href="/cursos" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6600] hover:bg-[#ff6600] rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Conheça Nossos Cursos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </FadeInUp>
      </div>
    </section>
  );
}
