'use client';

import { Button } from '@/components/ui/button';
import { 
  Award,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function RegularCourseSection({ course, formatPrice, isBlackNovember = true }) {
  // Não renderizar se o curso não tiver modalidade por aproveitamento
  if (!course.aproveitamento) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-semibold text-sm mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Modalidade Regular Disponível
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Curso <span className="text-[#0b3b75]">Regular</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Prefere uma formação mais completa e aprofundada? Conheça nossa modalidade regular com mais tempo para absorver todo o conteúdo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
          {/* Lado esquerdo - Informações */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-[#0b3b75]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Formação Completa</h3>
                  <p className="text-blue-600 font-medium max-md:text-sm">A partir de {course.minTime} meses</p>
                </div>
              </div>
              <p className="text-gray-600">
                Tenha mais tempo para absorver todo o conteúdo com uma metodologia estruturada e progressiva, ideal para quem está começando na área.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-[#0b3b75]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Aprendizado Gradual</h3>
                  <p className="text-blue-600 font-medium max-md:text-sm">Metodologia estruturada</p>
                </div>
              </div>
              <p className="text-gray-600">
                Aprenda de forma gradual e consistente, com conteúdo distribuído ao longo do tempo para melhor fixação do conhecimento.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-[#0b3b75]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mesma Certificação</h3>
                  <p className="text-blue-600 font-medium max-md:text-sm">Reconhecimento MEC e SISTEC</p>
                </div>
              </div>
              <p className="text-gray-600">
                Certificação com a mesma validade nacional da modalidade por aproveitamento, reconhecida pelo MEC e registrada no SISTEC.
              </p>
            </div>
          </div>

          {/* Lado direito - Comparação e CTA */}
          <div className="space-y-8">
            {/* Comparação de preços */}
            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border-2 border-[#0b3b75] relative overflow-hidden">
              {/* Black November Badge */}
              {isBlackNovember && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">40% OFF</span>
                  </div>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Modalidade Regular</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#0b3b75]">
                    {formatPrice(course.price)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">ou 12x de R$ 89,90 no cartão</p>
              </div>

              <div className="space-y-4 mb-3">
                {[
                  'Formação completa e estruturada',
                  `Duração de ${course.minTime} meses`,
                  'Certificação MEC/SISTEC',
                  'Suporte especializado',
                  'Material didático incluído'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0b3b75] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={`/cursos/${course.slug}`}>
                <Button
                  className="w-full bg-[#0b3b75] max-md:text-xs hover:bg-[#094066] text-white py-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Matricular na Modalidade Regular
                  <ArrowRight className="ml-2 h-5 w-5 max-md:hidden" />
                </Button>
              </Link>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                7 dias de garantia incondicional
              </p>
            </div>

            {/* Comparação com curso por aproveitamento */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Comparação com Por Aproveitamento</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">Por Aproveitamento</p>
                  <p className="text-[#ff6600] font-bold">{formatPrice(course.aproveitamentoPrice || course.price * 1.3)}</p>
                  <p className="text-gray-600">A partir de 30 dias</p>
                </div>
                <div className="text-center border-l border-gray-300 pl-4">
                  <p className="font-medium text-gray-900">Curso Regular</p>
                  <p className="text-[#0b3b75] font-bold">{formatPrice(course.price)}</p>
                  <p className="text-gray-600">{course.minTime} meses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
