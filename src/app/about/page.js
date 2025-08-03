import Image from 'next/image';
import data from '@/data/courses.json';
import { Metadata } from 'next';
import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Sobre Nós - Uniconnect',
  description: 'Conheça a história, missão e valores da Uniconnect, e nossa equipe de instrutores dedicados.',
};

export default function AboutPage() {

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/40">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Nossa Missão é Transformar Vidas</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-muted-foreground">
            Acreditamos no poder da educação para criar novas oportunidades e construir um futuro melhor para todos.
          </p>
        </div>
      </section>  

      {/* Our Story Section */}
      <section className="py-16 sm:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">A História da Uniconnect</h2>
            <p className="text-muted-foreground mb-4">
              Fundada em 2020, a Uniconnect nasceu do sonho de democratizar o acesso à educação técnica de qualidade no Brasil. Percebemos que muitos talentos eram desperdiçados pela falta de acesso a um ensino flexível e alinhado com as demandas do mercado de trabalho.
            </p>
            <p className="text-muted-foreground">
              Começamos com apenas três cursos e uma pequena equipe de instrutores apaixonados. Hoje, somos uma das principais escolas EAD do país, com milhares de alunos formados e uma comunidade vibrante que não para de crescer.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Educação de ponta e acessível.</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Foco total no sucesso do aluno.</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Conexão com o mercado de trabalho.</span></li>
            </ul>
          </div>
          <div>
            <Image 
              src="/images/about-us.jpg" // Placeholder image
              alt="Equipe Uniconnect"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 sm:py-24 bg-muted/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Nossos Instrutores</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
              Profissionais renomados e com vasta experiência de mercado, prontos para guiar você em sua jornada de aprendizado.
            </p>
          </div>
          <div className="text-center text-muted-foreground">
            <p>Em breve, você conhecerá nossos instrutores!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
