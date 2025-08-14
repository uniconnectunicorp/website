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
// Importando os tipos do projeto
import { Header } from '@/components/layout/Header';
import { CourseContentSection } from '@/components/course-details/CourseContentSection';
import { CompetencySection } from '@/components/course-details/CompetencySection';
import CTASection from '@/components/home/CTASection';
import { CourseFAQ } from '@/components/course-details/faq';
import AboutUsCourse from '@/components/course-details/AboutUs';
import { toast } from 'react-toastify';



export function CourseDetailsClient({ course }) {
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const handleEnrollmentSuccess = () => {
    setEnrollmentSuccess(true);
    // Fechar o modal após 3 segundos
    setTimeout(() => {
      setIsEnrollmentModalOpen(false);
      setEnrollmentSuccess(false);
    }, 3000);
  };

  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const currentPrice = formatPrice(course.price);
  const originalPrice = formatPrice(course.originalPrice);
  const modules = (course.modulos || []).map((module) => {
    const lessons = (module.componentes_curriculares || []).map(lesson => ({
      ...lesson,
      type: (lesson.type || 'video'),
      carga_horaria: typeof lesson.carga_horaria === 'string' 
        ? parseInt(lesson.carga_horaria, 10) || 0 
        : Number(lesson.carga_horaria) || 0
    }));
    
    return {
      ...module,
      lessons
    };
  });

  const processedModules = modules;

  const totalWorkload = processedModules.reduce((total, module) => {
    const moduleWorkload = module.carga_horaria;
    return total + moduleWorkload;
  }, 0);

  

  return (
    <div className="min-h-screen overflow-x-hidden">
       
      {/* Cabeçalho do curso */}
      <div className="relative bg-[#0b3b75] pt-20 text-white overflow-hidden">
        {/* Efeitos visuais de fundo */}
        <div className="absolute max-md:hidden inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute max-md:hidden -top-32 -right-32 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute max-md:hidden -bottom-32 -left-32 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
           <Header />
          <div className="lg:grid lg:grid-cols-12 grid-cols-1 lg:gap-8">
            {/* Conteúdo principal (esquerda) */}
            <div className="lg:col-span-7 relative z-10">
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm text-blue-100 border border-white/20">
                Formação a partir de {course.minTime} meses
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {course.nome}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-blue-100">
                Você está a poucos passos de mudar sua vida profissional. 
                Com uma formação rápida, reconhecida pelo MEC e registrada no SISTEC, 
                você se torna {course.nome} com validade nacional e ao finalizar 
                 {course.response ? ` você pode emitir seu ${course.response}. ` : ' você pode emitir seu Certificado. '} 
                Conquiste o espaço que merece no mercado — com respeito, segurança e crescimento real.
                </p>
                
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-blue-200">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>{modules?.length || 0} Módulos</span>
                  </div>
                  
                  <div className="flex items-center text-blue-200">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Carga horária de {totalWorkload} horas</span>
                  </div>
                </div>

                {/* Lista de benefícios movida para o lado esquerdo */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Benefícios do Curso</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Reconhecido MEC e SISTEC</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Formação a partir de {course.minTime} meses</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">100% Online</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Acesso imediato após a compra</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-blue-100">Certificado até 30 dias após a conclusão</span>
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
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{currentPrice}</span>
                    {course.originalPrice > course.price && (
                      <>
                        <span className="ml-3 text-lg text-blue-200 line-through">
                          {originalPrice}
                        </span>
                        
                      </>
                    )}
                  </div>
                  
                  <p className="text-blue-100 text-lg">
                    ou 12x de R$79,90 sem juros
                  </p>
                  
                  {/* Formulário de Matrícula Direto */}
                  <div className="">
                    <h4 className="text-white text-xl font-bold mb-4 text-center">Garanta sua vaga agora mesmo</h4>
                    <p className="text-blue-100 text-sm text-center mb-4">Preencha os dados abaixo e dê o primeiro passo na sua jornada profissional</p>
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

      {/* Seção de benefícios */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#0b3b75] bg-blue-100 rounded-full mb-3">POR QUE ESCOLHER NOSSO CURSO?</span>
            <h2 className="text-4xl font-bold text-gray-900">Transforme seu futuro com nossa metodologia exclusiva</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <Monitor className="h-10 w-10 text-[#0b3b75]" />,
                title: "Ambiente 100% Online",
                description: "Estude de forma totalmente digital — aulas, conteúdos e provas disponíveis onde você estiver."
              },
              {
                icon: <BookOpen className="h-10 w-10 text-[#0b3b75]" />,
                title: "Material de Apoio Completo",
                description: "Tenha acesso a videoaulas, apostilas e uma central de suporte com tudo o que você precisa para aprender com qualidade."
              },
              {
                icon: <Clock className="h-10 w-10 text-[#0b3b75]" />,
                title: "Flexibilidade Total",
                description: "Você escolhe o melhor horário e lugar para estudar — sem pressa, no seu ritmo."
              },
              {
                icon: <Users className="h-10 w-10 text-[#0b3b75]" />,
                title: "Suporte Especializado",
                description: "Conte com professores altamente qualificados prontos para tirar suas dúvidas e te acompanhar na jornada."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-blue-100 w-full"
              >
                <div className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center bg-blue-50 rounded-xl mb-4 flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <CourseContentSection
        modules={modules}
        totalDuration={totalWorkload}
        totalLessons={modules?.length}
        requirements={course.requirements}
      />

    <CourseFAQ />


    <SistecAndMec />


          {/* Seção Modalidade por Competência */}
         <CompetencySection 
        course={course}
        formatPrice={formatPrice}
      />

    <AboutUsCourse />

    
      {/* <div className="bg-[#0b3b75]">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Pronto para começar?</span>
              <span className="block">Matricule-se agora mesmo!</span>
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              Invista no seu futuro profissional com um dos melhores cursos do mercado.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => setIsEnrollmentModalOpen(true)}
                className="px-8 py-4 text-base font-medium rounded-full bg-white text-[#0b3b75] hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105"
              >
                Quero me matricular agora
              </Button>
              <p className="mt-3 text-sm text-blue-100">
                7 dias de garantia incondicional ou seu dinheiro de volta.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <CTASection courseName={course.nome} />

      {/* Modal de Matrícula */}
      <Dialog open={isEnrollmentModalOpen} onOpenChange={setIsEnrollmentModalOpen}>
        <DialogTitle>

        </DialogTitle>
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
              courseTitle={course.title}
              coursePrice={course.price}
              onSuccess={handleEnrollmentSuccess}
              onClose={() => setIsEnrollmentModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
