import { BookOpen, Users, Clock, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import FadeInUp from "@/components/client/FadeInUp";

const features = [
  {
    icon: BookOpen,
    title: "Cursos Técnicos",
    description: "Cursos alinhados com as demandas do mercado de trabalho.",
    color: "text-[#ff6600]"
  },
  {
    icon: Users,
    title: "Professores Especialistas",
    description: "Aprenda com profissionais atuantes no mercado.",
    color: "text-[#0b3b75]"
  },
  {
    icon: Clock,
    title: "Flexível",
    description: "Estude no seu ritmo, de qualquer lugar.",
    color: "text-green-600"
  },
  {
    icon: Award,
    title: "Certificado Válido",
    description: "Certificação reconhecida pelo MEC em todo Brasil.",
    color: "text-purple-600"
  },
];

export default function FeaturesSection() {
  return (
    <section id="como-funciona" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <FadeInUp>
           
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Por que escolher a <span className="text-[#0b3b75]">Uniconnect</span> para sua formação?
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-gray-600">
              Oferecemos uma experiência completa de aprendizado técnico com foco na empregabilidade e desenvolvimento profissional.
            </p>
          </FadeInUp>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {features.map((feature, index) => (
            <FadeInUp key={index} delay={0.1 * (index + 1)}>
              <div className="group relative flex flex-col h-full bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
                <div className="rounded-xl bg-[#0b3b75] p-3 inline-flex items-center justify-center w-14 h-14 mb-5">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed  flex-grow">
                  {feature.description}
                </p>
                {/* <div className="mt-auto pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center text-sm font-medium text-[#0b3b75] group-hover:text-[#0b3b75] transition-colors">
                    Saiba mais
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div> */}
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
