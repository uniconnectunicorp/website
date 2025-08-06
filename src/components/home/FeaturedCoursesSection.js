import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FadeInUp from "@/components/client/FadeInUp";
import { CourseCard } from "@/components/cards/CourseCard";
import { getHighRatedCourses } from '@/data/course';



export default function FeaturedCoursesSection() {
  const featuredCourses = getHighRatedCourses(["eletrotecnica", "mecanica", "seguranca-do-trabalho"]);
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeInUp>
           
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos <span className="text-[#0b3b75]">Cursos em Destaque</span>
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça os cursos técnicos mais procurados e dê o próximo passo na sua carreira profissional.
            </p>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, index) => (
            <FadeInUp key={course.slug} delay={0.1 * (index + 1)}>
              <div className="h-full">
                <CourseCard 
                  course={course} 
                  
                />
              </div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3}>
          <div className="mt-16 text-center">
            <Link 
              href="/cursos"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6600] hover:bg-[#ff6600] rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ver Todos os Cursos Técnicos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
