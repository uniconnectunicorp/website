'use client';

import { Button } from '@/components/ui/button';
import { 
  Award,
  Zap,
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export function CompetencySection({ course, formatPrice, onEnrollClick }) {
  // Não renderizar se o curso não tiver modalidade por competência
  if (!course.competency) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 font-semibold text-sm mb-4">
            <Award className="h-4 w-4 mr-2" />
            Modalidade Especial Disponível
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Curso por <span className="text-[#ff6600]">Competência</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acelere sua formação com nossa modalidade por competência. Ideal para quem já tem experiência na área e quer certificação mais rápida.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
          {/* Lado esquerdo - Informações */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-[#ff6600]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Formação Acelerada</h3>
                  <p className="text-orange-600 font-medium max-md:text-sm">A partir de 45 dias</p>
                </div>
              </div>
              <p className="text-gray-600">
                Comprove suas competências através de avaliações práticas e teóricas, reduzindo significativamente o tempo de formação.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 max-md:p-6shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-[#ff6600]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Foco na Prática</h3>
                  <p className="text-orange-600 font-medium max-md:text-sm">Avaliação por competências</p>
                </div>
              </div>
              <p className="text-gray-600">
                Demonstre na prática o que você já sabe e obtenha sua certificação baseada em competências reais do mercado de trabalho.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6 max-md:text-sm">
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-[#ff6600]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mesma Certificação</h3>
                  <p className="text-orange-600 font-medium">Reconhecimento MEC e SISTEC</p>
                </div>
              </div>
              <p className="text-gray-600">
                Certificação com a mesma validade nacional do curso regular, reconhecida pelo MEC e registrada no SISTEC.
              </p>
            </div>
          </div>

          {/* Lado direito - Comparação e CTA */}
          <div className="space-y-8">
            {/* Comparação de preços */}
            <div className="bg-white rounded-2xl p-8 max-md:p-6 shadow-lg border-2 border-[#ff6600]">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Modalidade por Competência</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#ff6600]">
                    {formatPrice(course.competencyPrice || course.price * 1.3)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">ou 12x de R$ 109,90 no cartão</p>
              </div>

              <div className="space-y-4 mb-3">
                {[
                  'Avaliação por competências',
                  'Formação a partir de 45 dias',
                  'Certificação MEC/SISTEC',
                  'Suporte especializado',
                  'Material didático incluído'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#ff6600] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={`/cursos/competencia/${course.slug}`}>
              <Button
                className="w-full max-md:text-xs bg-[#ff6600] hover:bg-[#e55a00] text-white py-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Matricular na Modalidade por Competência
                <ArrowRight className="ml-2 h-5 w-5 max-md:hidden" />
              </Button>
              </Link>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                7 dias de garantia incondicional
              </p>
            </div>

            {/* Comparação com curso regular */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Comparação com Curso Regular</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">Curso Regular</p>
                  <p className="text-[#0b3b75] font-bold">{formatPrice(course.price)}</p>
                  <p className="text-gray-600">{course.minTime} meses</p>
                </div>
                <div className="text-center border-l border-gray-300 pl-4">
                  <p className="font-medium text-gray-900">Por Competência</p>
                  <p className="text-[#ff6600] font-bold">{formatPrice(course.competencyPrice || course.price * 1.3)}</p>
                  <p className="text-gray-600">A partir de 45 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
