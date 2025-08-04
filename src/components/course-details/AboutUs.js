import { Briefcase, Users, Zap, CheckCircle } from 'lucide-react';

export default function AboutUsCourse() {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nascemos para <span className="text-[#0b3b75]">conectar você</span> ao futuro.
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              A Uniconect não é apenas uma instituição de ensino. Nascemos da paixão por tecnologia e da crença de que a educação é a ferramenta mais poderosa para transformar vidas. Vimos a lacuna entre o ensino tradicional e as reais necessidades do mercado de trabalho e decidimos criar a solução.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Somos uma plataforma de aprendizado que é direta, prática e verdadeiramente conectada com as profissões que mais crescem. Nossa missão é ser a ponte para a sua carreira de sucesso.
            </p>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="space-y-8">
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-[#0b3b75]">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Foco na Prática</h3>
                  <p className="mt-1 text-base text-gray-600">
                    Acreditamos que se aprende fazendo. Nossos cursos são desenhados com base em projetos reais, para que você desenvolva as habilidades que as empresas realmente procuram.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-[#0b3b75]">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Instrutores do Mercado</h3>
                  <p className="mt-1 text-base text-gray-600">
                    Nossos professores não são apenas acadêmicos; são profissionais experientes que trazem o dia a dia do mercado para a sala de aula.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-[#0b3b75]">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Aprendizado Acelerado</h3>
                  <p className="mt-1 text-base text-gray-600">
                    Metodologia focada no que realmente importa, sem enrolação. Preparamos você para o mercado de forma rápida e eficiente.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}