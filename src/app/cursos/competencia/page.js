'use client'
import { GraduationCap, Search, Clock, Star, BookOpen, Award, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { getCompetenciaCourseCount, paginateCompetencia, getCompetenciaCourseByName } from '@/data/course';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Head from '@/components/layout/Head';
import Link from 'next/link';
import Image from 'next/image';

export default function CompetenciaPage() {
  const totalCourses = getCompetenciaCourseCount();
  const [courses, setCourses] = useState(paginateCompetencia(1));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const searchCourses = (search) => {
    if (!search) return;
    const result = getCompetenciaCourseByName(search.toString());
    if (result && result.length > 0) {
      setCourses(result);
      setIsSearchActive(true);
    } else {
      setCourses(paginateCompetencia(1));
      setIsSearchActive(false);
      toast.error('Nenhum curso encontrado');
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setCourses(paginateCompetencia(1));
    setIsSearchActive(false);
  };

  const showAll = () => {
    const allCourses = getCompetenciaCourseByName('') || paginateCompetencia(1);
    setCourses(paginateCompetencia(1));
  };

  const [showAllCourses, setShowAllCourses] = useState(false);

  const loadMore = () => {
    setShowAllCourses(true);
    const all = [];
    let page = 1;
    while (true) {
      const batch = paginateCompetencia(page);
      if (batch.length === 0) break;
      all.push(...batch);
      page++;
    }
    setCourses(all);
  };

  return (
    <>
      <Head title="Uniconnect | Cursos por Competência" description="Diploma em até 5 dias! Cursos técnicos por competência reconhecidos pelo MEC." />

      <div className="min-h-screen pt-20">
        <Header />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#0b3b75] to-[#0b3b75] text-white pt-9 pb-6">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white mb-6 border border-white/20">
                <Award className="h-4 w-4 mr-2" />
                Diploma em até 5 dias
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossos Cursos por Competência</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
                Valide seus conhecimentos e obtenha seu diploma técnico de forma rápida e reconhecida pelo MEC e SISTEC.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 border-0 rounded-lg bg-white/10 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0b3b75] focus:outline-none transition-all duration-200"
                    placeholder="Buscar cursos por competência..."
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
                  <span className="font-medium">{totalCourses} cursos</span> disponíveis
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Link
                  key={course.slug}
                  href={`/cursos/competencia/${course.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0b3b75]/20 hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.nome}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center px-3 py-1 bg-[#0b3b75] text-white text-xs font-semibold rounded-full">
                        {course.area}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-3 py-1 bg-[#ff6600] text-white text-xs font-bold rounded-full">
                        5 dias
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0b3b75] transition-colors">
                      {course.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 line-through">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.originalPrice)}
                        </span>
                        <span className="text-lg font-bold text-[#0b3b75] ml-2">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                        </span>
                      </div>
                      <span className="inline-flex items-center text-sm font-medium text-[#0b3b75] group-hover:text-[#ff6600] transition-colors">
                        Ver curso
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {!showAllCourses && courses.length < totalCourses && !isSearchActive && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center px-8 py-3 bg-[#0b3b75] text-white font-medium rounded-lg hover:bg-[#094066] transition-colors cursor-pointer"
                >
                  Ver todos os cursos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
