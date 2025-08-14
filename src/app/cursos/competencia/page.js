'use client'
import { GraduationCap, Search, Filter, Clock, Star, BookOpen, MapPin, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { paginate, getCourseCount, getCourseByName } from '@/data/course';
import CoursesSection from '../_components/CoursesSection';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Head from '@/components/layout/Head';


export default function CompetencyPage() {
  const courses = getCourseCount(true)
  const [initialCourses, setInitialCourses] = useState(paginate(1, true))

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const searchCourses = (search) => {
    if (!search) return;
    const result = getCourseByName(search.toString())
    if (result) {
      setInitialCourses(result)
      setIsSearchActive(true);
    }
    if (!result || result.length === 0) {
      setInitialCourses(paginate(1, true))
      setIsSearchActive(false);
      toast.error('Nenhum curso encontrado');
    }
  }

  const resetSearch = () => {
    setSearchQuery('');
    setInitialCourses(paginate(1));
    setIsSearchActive(false);
  }
    
  

  const stats = [
    { 
      title: 'Cursos Disponíveis', 
      value: courses, 
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      description: 'Diversas opções para você' 
    },
    { 
      title: 'Modalidades', 
      value: '3', 
      icon: <BookOpen className="h-6 w-6 text-white" />,
      description: 'Presencial, Online e Híbrido' 
    },
    { 
      title: 'Horários Flexíveis', 
      value: 'Sim', 
      icon: <Clock className="h-6 w-6 text-white" />,
      description: 'Ajuste aos seus horários' 
    },
    { 
      title: 'Avaliação', 
      value: '4.8', 
      icon: <Star className="h-6 w-6 text-white fill-white/20" />,
      description: 'Média entre nossos alunos' 
    }
  ];

  return (
    <>
     <Head title="Uniconnect | Cursos por Competência" description="Encontre o seu caminho para o sucesso!" />
  
    <div className="min-h-screen pt-20">
     
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0b3b75] to-[#0b3b75] text-white pt-9 pb-6">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossos Cursos por Competência</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              Encontre o seu caminho para o sucesso!

            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400"  />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 border-0 rounded-lg bg-white/10 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0b3b75] focus:outline-none transition-all duration-200"
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchCourses(searchQuery);
                    }
                  }}
                />
                <button onClick={() => searchCourses(searchQuery)} className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white text-[#0b3b75] px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
                  Buscar
                </button>
              </div>
              
              {/* Mensagem de voltar pesquisa */}
              {isSearchActive && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={resetSearch}
                    className="text-sm text-blue-200 hover:text-white underline hover:no-underline transition-colors duration-200 cursor-pointer"
                  >
                    ← Voltar à pesquisa completa
                  </button>
                </div>
              )}
              
              <div className="text-lg text-white mt-8">
                    <span className="font-medium">{courses} cursos</span> disponíveis
                </div>
            </div>

            {/* Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.title}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      <CoursesSection coursesQuantity={courses} initialCourses={initialCourses} competency={true}/>
     
    </div>
    </>
  );
}

