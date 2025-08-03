import { Star } from 'lucide-react'
import Image from 'next/image'

export function Testimonials({ testimonials = [] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-4">
            <p className="text-sm font-medium text-orange-700">Depoimentos</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que nossos alunos <span className="text-blue-800">dizem</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Veja como nossos cursos estão transformando carreiras e realizando sonhos profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-100">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-orange-400' : 'text-gray-300'}`}
                    fill={i < testimonial.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Curso: <span className="font-medium text-blue-800">{testimonial.course || 'Técnico em Informática'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
