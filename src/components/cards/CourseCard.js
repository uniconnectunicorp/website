import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, BookOpen, Award, MapPin, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';



export function CourseCard({ course, category, className, onEnrollClick, competency }) {
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  const handleEnrollClick = () => {
    if (onEnrollClick) {
      onEnrollClick(course);
    }
  };

  return (
    <div className={cn(
      "group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-50 hover:-translate-y-1.5",
      className
    )}>
      {/* Image with overlay */}
      <div className="relative aspect-video overflow-hidden">
        <Link href={competency ? `/cursos/competencia/${course.slug}` : `/cursos/${course.slug}`} className="block h-full">
          <div className="relative w-full h-full">
            <Image
              src={course.image}
              alt={course.nome}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className={`text-white font-medium text-sm flex items-center ${!competency ? 'bg-[#0b3b75] hover:bg-[#0b3b75]' : 'bg-[#ff6600] hover:bg-[#ff6600]'} px-3 py-1.5 rounded-full transition-colors`}>
                Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
        
       
      </div>
      
      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Course Info */}
        <h3 className={`text-[#0b3b75] font-semibold text-lg mb-2 ${!competency ? 'text-[#0b3b75]' : 'text-[#ff6600]'}`}>{course.nome}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center text-xs  px-3 py-1 rounded-full font-medium ${!competency ? 'text-[#0b3b75] bg-blue-50' : 'text-[#ff6600] bg-orange-50'}`}>
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Formação a  partir de {course.minTime} meses
          </div>
          
         
        </div>
        
        {/* Course Title
        <h3 className={`text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight `}>
          <Link href={competency ? `/cursos/competencia/${course.slug}` : `/cursos/${course.slug}`}>
            {course.title}
          </Link>
        </h3>
         */}
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>
        
        {/* Course Details */}
        <div className="space-y-2.5 mb-4">
          {course.modality && (
            <div className="flex items-center text-sm text-gray-700">
              <BookOpen className={`w-4 h-4 mr-2  flex-shrink-0 ${!competency ? 'text-[#0b3b75]' : 'text-[#ff6600]'}`} />
              <span className="truncate">{course.modality}</span>
            </div>
          )}
          
          
        </div>
        
        {/* Price & CTA */}
        <div className="mt-auto border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <div>
              {hasDiscount ? (
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${!competency ? 'text-[#0b3b75]' : 'text-[#ff6600]'}`}>
                      {course.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                      {course.originalPrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    Economize {discountPercentage}% • {course.originalPrice && (course.originalPrice - course.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ) : (
                competency ? 
                <span className={`text-2xl font-bold ${!competency ? 'text-[#0b3b75]' : 'text-[#ff6600]'}`}>
                  {course.competencyPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
               : 
               <span className={`text-2xl font-bold ${!competency ? 'text-[#0b3b75]' : 'text-[#ff6600]'}`}>
                  {course.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
               )}
              <p className="text-sm text-gray-500 mt-0.5">
                ou 12x de {competency ? "109,90" : "79,90"} no cartão
              </p>
            </div>
            
            <div className="space-y-2">
              {onEnrollClick ? (
                <button 
                  onClick={handleEnrollClick}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-[#0b3b75] rounded-lg transition-all shadow-sm hover:shadow-md hover:bg-[#094066]"
                >
                  Matricule-se agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <Link 
                  href={competency ? `/cursos/competencia/${course.slug}` : `/cursos/${course.slug}`}
                  className={`w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white ${!competency ? 'bg-[#0b3b75] ' : 'bg-[#ff6600] hover:bg-[#ff6600]'} rounded-lg transition-all shadow-sm hover:shadow-md `}
                >
                  Matricule-se agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )}
              
              <div className="flex items-center justify-center text-xs text-gray-500">
                <div className="flex items-center mr-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                  <span>Vagas limitadas</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 mr-3"></div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#0b3b75] mr-1.5"></div>
                  <span>Início imediato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
