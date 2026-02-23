import { notFound } from 'next/navigation';
import { fetchCompetenciaCourseBySlug, getAllCompetenciaCourses } from "@/data/course";
import { CourseCompetenciaDetailsClient } from "./CourseCompetenciaDetailsClient";
import Head from '@/components/layout/Head';


export default async function CourseCompetenciaDetails({ params }) {
  const { slug } = await params;
  const course = await fetchCompetenciaCourseBySlug(slug);
  
  if (!course) {
    return notFound();
  } 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head title={`${course.nome} | Uniconnect`} image={course.image} description={`Obtenha seu diploma de ${course.nome} em até 5 dias. Curso por competência reconhecido pelo MEC e registrado no SISTEC.`} />
      <CourseCompetenciaDetailsClient 
        course={course} 
      />
    </div>
  );
}

export async function generateStaticParams() {
  const courses = getAllCompetenciaCourses();
  
  return courses.map((course) => ({
    slug: course.slug,
  }));
}