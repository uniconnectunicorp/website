import { notFound } from 'next/navigation';
import { fetchCourseBySlug } from "@/data/course";
import { CourseDetailsClient } from "./CourseDetailsClient";


export default async function CourseDetails({ params }) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);
  
  if (!course) {
    return notFound();
  } 
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CourseDetailsClient 
        course={course} 
      />
    </div>
  );
}