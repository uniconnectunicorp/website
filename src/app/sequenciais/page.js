'use client'
import { GraduationCap, Search, Filter, Clock, Star, BookOpen, MapPin, ArrowRight, Monitor } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { paginateSequential, getSequentialCourseCount, getSequentialCourseByName } from '@/data/sequential-course';
import SequentialCoursesSection from './_components/SequentialCoursesSection';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Head from '@/components/layout/Head';
import SequentialCoursePopup from '@/components/ui/SequentialCoursePopup';


export default function SequentialCoursesPage() {
  const courses = getSequentialCourseCount()
  const [initialCourses, setInitialCourses] = useState(paginateSequential(1))

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const searchCourses = (search) => {
    if (!search) return;
    const result = getSequentialCourseByName(search.toString())
    if (result) {
      setInitialCourses(result)
      setIsSearchActive(true);
    }
    if (!result || result.length === 0) {
      setInitialCourses(paginateSequential(1))
      setIsSearchActive(false);
      toast.error('Nenhum curso encontrado');
    }
  }

  const resetSearch = () => {
    setSearchQuery('');
    setInitialCourses(paginateSequential(1));
    setIsSearchActive(false);
  }

  return (
    <>
    <Head title="Uniconnect | Cursos Sequenciais" description="Cursos sequenciais de 4 a 6 meses, 100% EaD, com 560 horas de carga horária. Formação rápida para o mercado de trabalho." />
        <div className="min-h-screen pt-20">
      
      
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0b3b75] to-[#0b3b75] text-white pt-9 pb-6">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">Formação Rápida</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cursos Sequenciais</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
              Formação acelerada de 4 a 6 meses para impulsionar sua carreira
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>4 a 6 meses</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Modalidade EaD</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>560 horas</span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400"  />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 border-0 rounded-lg bg-white/10 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0b3b75] focus:outline-none transition-all duration-200"
                  placeholder="Buscar cursos sequenciais..."
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
          </div>
        </div>
      </section>

      <SequentialCoursesSection coursesQuantity={courses} initialCourses={initialCourses} />
      <SequentialCoursePopup />
    </div>
    </>
  );
}
