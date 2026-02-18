import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-primary overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
      <div className="relative max-w-7xl w-full px-4 pt-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-md:mt-4">
            <div className="space-y-6 text-left animate-fade-in-up">
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-50 border border-secondary-100">
                <p className="text-sm font-medium text-secondary">Cursos Técnicos 100% Online</p>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Formação profissional de <span className="text-primary">alta qualidade</span> para o mercado de trabalho
              </h1>
              
              <p className="text-lg text-gray-600">
                Cursos Profissionalizantes, Técnicos, EJA e Superior Sequencial de alta qualidade e com certificação válida em todo o Brasil. Aprende com especialistas e dê um salto na sua carreira profissional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cursos"
                  className="inline-flex z-10 items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6600] hover:bg-[#ff6600] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] hover:shadow-orange-200"
                >
                  Conheça Nossos Cursos
                  <span className="ml-2 animate-bounce-x">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-full">
            <div className="absolute -bottom-26 w-full h-full scale-125">
              <Image 
                src="/root/student.png" 
                alt="Estudantes em ambiente de aprendizado online" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain scale-x-[-1]"
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[url('/images/wave.svg')] bg-cover bg-bottom opacity-30" />
    </section>  
  );
}