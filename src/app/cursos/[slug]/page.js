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
      <Head title={`${course.nome} | Uniconnect`} image={course.image} description={course.description} />
      
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