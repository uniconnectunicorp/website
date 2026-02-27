'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, BookOpen, Zap, Trophy, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    label: 'Cursos Técnicos Regulares',
    href: '/cursos',
    icon: BookOpen,
    description: 'Diploma reconhecido pelo MEC em até 18 meses',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Cursos por Aproveitamento',
    href: '/cursos/aproveitamento',
    icon: Trophy,
    description: 'Para quem já atua na área, diploma em tempo reduzido',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Cursos por Competência',
    href: '/cursos/competencia',
    icon: Zap,
    description: 'Diploma em 5 dias úteis validando sua experiência',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    label: 'Cursos Sequenciais',
    href: '/cursos/sequencial',
    icon: GraduationCap,
    description: 'Formação superior de curta duração',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'EJA',
    href: '/cursos/eja',
    icon: Users,
    description: 'Educação de Jovens e Adultos',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

export default function HeroSection() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchend', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchend', handleOutside);
    };
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-white to-primary flex flex-col items-center">
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
                <div ref={ref} className="relative z-[60]">
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6600] hover:bg-[#e55a00] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] hover:shadow-orange-200 gap-2"
                  >
                    Conheça Nossos Cursos
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]">
                      {categories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-0"
                        >
                          <div className={`w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                            <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                          </div>
                          <p className="text-[13px] font-semibold text-gray-800 group-hover:text-[#ff6600] transition-colors">{cat.label}</p>
                          <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-[#ff6600] shrink-0 ml-auto transition-colors" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-full pointer-events-none">
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
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[url('/images/wave.svg')] bg-cover bg-bottom opacity-30 pointer-events-none" />
    </section>  
  );
}