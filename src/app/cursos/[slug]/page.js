import { notFound } from 'next/navigation';
import { fetchCourseBySlug, fetchCourses } from "@/data/course";
import Head from '@/components/layout/Head';
import { CourseDetailsClient } from "./CourseDetailsClient";




export default async function CourseDetails({ params }) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);
  
  if (!course) {
    return notFound();
  } 
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head title={`${course.nome} | Uniconnect`} image={course.image} description={`Você está a poucos passos de mudar sua vida profissional. Com uma formação rápida, reconhecida pelo MEC e registrada no SISTEC, você se torna ${course.nome} com validade nacional e ao finalizar ${course.response ? ` você pode emitir seu ${course.response}. ` : ' você pode emitir seu Certificado. '} Conquiste o espaço que merece no mercado — com respeito, segurança e crescimento real.`} />
      
      <CourseDetailsClient 
        course={course} 
      />
    </div>
  );
}


export async function generateStaticParams() {
  const courses = fetchCourses();
  
  return courses.map((course) => ({
    slug: course.slug,
  }));
}