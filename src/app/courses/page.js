import { GraduationCap, Search, Filter, Clock, Star, BookOpen, MapPin, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/client/FadeIn';
import { fetchCourses } from '@/data/course';

export const metadata = {
  title: 'Nossos Cursos - Uniconnect',
  description: 'Explore nossa grade completa de cursos técnicos e profissionalizantes.',
};

export default function CoursesPage() {
  const courses = fetchCourses()

  // Stats for the hero section
  const stats = [
    { 
      title: 'Cursos Disponíveis', 
      value: courses.length, 
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
    <div className="min-h-screen pt-20">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossos Cursos</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              Encontre o curso perfeito para impulsionar sua carreira profissional
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 border-0 rounded-lg bg-white/10 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 focus:outline-none transition-all duration-200"
                  placeholder="Buscar cursos..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
                  Buscar
                </button>
              </div>
            </div>

            {/* Stats */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{courses.length} cursos</span> disponíveis
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Ordenar por: Destaque</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Mais recentes</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <FadeIn key={course.slug} delay={0.1 * (index % 3)}>
              <CourseCard 
                course={{
                  ...course,
                  modality: ['Presencial', 'Online', 'Híbrido'][Math.floor(Math.random() * 3)],
                  location: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Online'][Math.floor(Math.random() * 4)],
                  level: ['Iniciante', 'Intermediário', 'Avançado'][Math.floor(Math.random() * 3)],
                }}
              />
            </FadeIn>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <Button variant="outline" className="px-8 py-6 text-base font-medium">
            Carregar mais cursos
          </Button>
        </div>
      </main>
    </div>
  );
}
