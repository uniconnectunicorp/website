import { Briefcase, Users, Zap, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsCourse() {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-20 sm:py-28 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-transparent rounded-full -ml-36 -mt-36 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200 to-transparent rounded-full -mr-48 -mb-48 opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 grid-cols-1 lg:gap-16 lg:items-center">
          
          <div className="lg:col-span-1">
            {/* Enhanced left side content */}
            <div className="relative">
             
              <div className="pl-8 max-md:pl-0">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-[#0b3b75] text-sm font-semibold rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#0b3b75] rounded-full mr-2 animate-pulse"></span>
                  Coronel Fabriciano - MG
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                  Polo Educacional{' '}
                  <span className="relative inline-block">
                    <span className="text-[#0b3b75]">Uniconnect</span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#0b3b75] to-blue-400 rounded-full"></div>
                  </span>
                </h2>
                
                <div className="mt-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-[#0b3b75] rounded-full mt-3"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Somos o <strong className="text-[#0b3b75]">Polo Educacional Uniconnect</strong>, localizado em Coronel Fabriciano-MG, com o compromisso de preparar e capacitar profissionais com um nível educacional e profissional de excelência.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-3"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Estamos aqui para ajudar a você a <strong>impulsionar sua carreira profissional</strong> com um curso de <strong className="text-[#0b3b75]">alta qualidade</strong>.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-[#0b3b75] rounded-full mt-3"></div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Nossos cursos te ajudam a <strong>ir além em sua carreira profissional</strong>: cursos profissionalizantes, técnicos, EJA, Superior Sequencial e <strong className="text-[#0b3b75]">muito mais</strong>.
                    </p>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-[#0b3b75] rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Nosso Compromisso</h3>
                  </div>
                  <p className="text-gray-700 font-medium mb-4">
                    Estarei ao seu lado desde a matrícula até a conquista do seu diploma. Você está a um passo do sucesso e do conhecimento.
                  </p>
                  
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-1 flex justify-center lg:justify-end h-full">
            {/* Uniconnect Logo Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100 h-full w-full relative overflow-hidden flex items-center justify-center">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
              
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-center">
                  <div className='w-full h-64 relative'>
                    <Image src="/root/logo-azul.webp" alt="Uniconnect Logo" fill className="object-contain drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}