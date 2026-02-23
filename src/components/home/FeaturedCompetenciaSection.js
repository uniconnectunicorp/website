import { ArrowRight, Award, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FadeInUp from "@/components/client/FadeInUp";
import { fetchCompetenciaCourses } from '@/data/course';

export default function FeaturedCompetenciaSection() {
  const allCourses = fetchCompetenciaCourses();
  const featuredCourses = allCourses.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-[#0b3b75] font-semibold text-sm mb-4">
              <Award className="h-4 w-4 mr-2" />
              Diploma em até 5 dias
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cursos por <span className="text-[#0b3b75]">Competência</span>
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Valide seus conhecimentos e experiência profissional. Obtenha seu diploma técnico reconhecido pelo MEC em até 5 dias.
            </p>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => (
            <FadeInUp key={course.slug} delay={0.1 * (index + 1)}>
              <Link
                href={`/cursos/competencia/${course.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0b3b75]/20 hover:-translate-y-1 block h-full"
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
                    <span className="inline-flex items-center px-3 py-1 bg-[#ff6600] text-white text-xs font-bold rounded-full gap-1">
                      <Zap className="h-3 w-3" />
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
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3}>
          <div className="mt-16 text-center">
            <Link
              href="/cursos/competencia"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#0b3b75] hover:bg-[#094066] rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ver Todos os Cursos por Competência
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
