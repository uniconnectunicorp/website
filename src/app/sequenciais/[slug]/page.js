import { notFound } from 'next/navigation';
import { fetchSequentialCourseBySlug, fetchSequentialCourses } from "@/data/sequential-course";
import Head from '@/components/layout/Head';
import { SequentialCourseDetailsClient } from "./SequentialCourseDetailsClient";




export default async function SequentialCourseDetails({ params }) {
  const { slug } = await params;
  const course = await fetchSequentialCourseBySlug(slug);
  
  if (!course) {
    return notFound();
  } 
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head title={`${course.nome} | Cursos Sequenciais | Uniconnect`} image={course.image} description={`Curso Sequencial em ${course.nome} — formação de ${course.duration}, modalidade ${course.modality}, com ${course.workload} horas de carga horária. Invista no seu futuro profissional com a Uniconnect.`} />
      
      <SequentialCourseDetailsClient 
        course={course} 
      />
    </div>
  );
}


export async function generateStaticParams() {
  const courses = fetchSequentialCourses();
  
  return courses.map((course) => ({
    slug: course.slug,
  }));
}
