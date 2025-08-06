'use client';
import { Metadata } from 'next';
import { Check, Users, BookOpen, Award, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Componente de Card animado
const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="h-full"
  >
    {children}
  </motion.div>
);



export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-6">
                Bem-vindo à Uniconnect
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl bg-clip-text  bg-gradient-to-r from-[#0b3b75] to-[#0b3b75]">
                Educação Profissional de Excelência
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                Somos o Polo Educacional Uniconnect, unidade parceira da Unicorp em Coronel Fabriciano-MG, preparando e capacitando profissionais com excelência educacional e profissional.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group bg-[#0b3b75] hover:bg-[#0b3b75]/90 text-white">
                  <Link href="/cursos" className="flex items-center gap-2">
                    Conheça Nossos Cursos
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.8))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-4">
                Nossa Missão
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Educação que <span className="text-[#0b3b75]">Transforma</span></h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  O Polo Educacional Uniconnect nasceu com o propósito de oferecer educação profissional de qualidade, preparando estudantes para os desafios do mercado de trabalho. Como unidade parceira da Unicorp, trazemos para Coronel Fabriciano-MG uma proposta inovadora em educação técnica.
                </p>
                <p>
                  Nossos cursos são 100% EAD, permitindo que você estude no seu próprio ritmo, de qualquer lugar. Contamos com uma equipe de professores experientes e uma plataforma de ensino completa, garantindo que você tenha todo o suporte necessário para sua formação profissional.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                      <Check className="h-5 w-5 text-[#0b3b75]" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Cursos validados</span> pelo MEC e SISTEC
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="mt-10 lg:mt-0 relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-sm mb-6">
                      <GraduationCap className="h-8 w-8 text-[#0b3b75]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ensino de Qualidade</h3>
                    <p className="text-gray-600">Cursos técnicos 100% EAD com certificação reconhecida</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reconhecimento</p>
                    <p className="text-lg font-bold text-gray-900">Parceiro Unicorp</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nossos Diferenciais */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-4">
              Diferenciais
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que estudar na <span className="text-[#0b3b75]">Uniconnect</span>?</h2>
            <p className="text-xl text-gray-600">
              Educação profissional de qualidade ao seu alcance
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "Cursos Reconhecidos",
                description: "Nossos cursos são validados pelo MEC e SISTEC, garantindo qualidade e credibilidade.",
                color: "blue"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Acompanhamento Personalizado",
                description: "Estamos ao seu lado desde a matrícula até a conquista do seu diploma.",
                color: "green"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Flexibilidade Total",
                description: "Cursos 100% EAD para você estudar quando e onde quiser.",
                color: "purple"
              }
            ].map((item, index) => (
              <AnimatedCard key={item.title} delay={index * 0.1}>
                <div className={`h-full bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1`}>
                  <div className={`h-14 w-14 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <a href="#" className="inline-flex items-center text-sm font-medium text-[#0b3b75] hover:text-[#0b3b75] group">
                      Saiba mais
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-r from-[#0b3b75] to-[#0b3b75] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[#0b3b75] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Pronto para transformar sua carreira?</h2>
            <p className="text-xl text-blue-100 mb-10">
              Você está a um passo do sucesso e do conhecimento. Venha conosco!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-[#0b3b75] hover:bg-blue-50 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/cursos" className="flex items-center gap-2">
                  Ver Cursos Disponíveis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
             
            </div>
            <p className="mt-6 text-sm text-blue-200">
              Cursos 100% EAD com certificação reconhecida
            </p>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
