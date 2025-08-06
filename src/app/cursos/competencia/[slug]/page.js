import { notFound } from 'next/navigation';
import { fetchCourseBySlug, getCompetencyCourses } from "@/data/course";
import { CourseCompetencyDetailsClient } from "./CourseCompetencyDetailsClient";
import Head from '@/components/layout/Head';


export default async function CourseCompetencyDetails({ params }) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);
  
  if (!course) {
    return notFound();
  } 
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head title={`${course.nome} | Uniconnect`} image={course.image} description={course.description} />
      <CourseCompetencyDetailsClient 
        course={course} 
      />
    </div>
  );
}

export async function generateStaticParams() {
  const courses = getCompetencyCourses();
  
  return courses.map((course) => ({
    slug: course.slug,
  }));
}