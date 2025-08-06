"use client"
import { Button } from '@/components/ui/button'
import FadeIn from '@/components/client/FadeIn';
import { CourseCard } from '@/components/cards/CourseCard';
import { loadMore } from '@/data/server-actions/loadMore';
import { useState, useEffect } from 'react';

export default function CoursesSection({ coursesQuantity, initialCourses, competency  }) {

    const [page, setPage] = useState(1);
    const [courses, setCourses] = useState(initialCourses);
    const [loading, setLoading] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // Sincronizar courses quando initialCourses mudar
    useEffect(() => {
        setCourses(initialCourses);
        setPage(1); // Reset página quando buscar
        // Detectar se estamos em modo de pesquisa (não é a paginação padrão)
        setIsSearchMode(initialCourses.length !== 6 || page > 1);
    }, [initialCourses]);


    const handleLoadMore = async () => {
        setLoading(true)
        const nextPage = page + 1;
        const newCourses = await loadMore(nextPage); 
        setLoading(false)
        setCourses((prev) => [...prev, ...newCourses]); 
        setPage(nextPage); 
      };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" >
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                    <FadeIn key={course.slug} delay={0.1 * (index % 3)}>
                        <CourseCard
                            course={{
                                ...course,
                            }}
                            competency={competency}
                                />
                    </FadeIn>
                ))}
            </div>
            <div className="mt-16 text-center">
               {!isSearchMode && courses.length < coursesQuantity && (
                <Button
                    variant="outline"
                    className={`group px-8 py-6 text-base font-medium relative overflow-hidden transition-all duration-300
                    border-2 ${!competency ? 'border-[#0b3b75] text-[#0b3b75] hover:bg-[#0b3b75] hover:shadow-md hover:border-[#0b3b75]' : 'border-[#ff6600] text-[#ff6600] hover:bg-[#ff6600] hover:shadow-md hover:border-[#ff6600]'}
                    hover:scale-[1.02] hover:text-white cursor-pointer active:scale-95 rounded-lg`}
                    onClick={handleLoadMore}
                    disabled={loading}
                >
                    <span className={`relative z-10 flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Carregar mais cursos
                    </span>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`h-5 w-5 border-2 ${!competency ? 'border-[#0b3b75] border-t-transparent' : 'border-[#ff6600] border-t-transparent'} rounded-full animate-spin`} />
                        </div>
                    )}
                </Button>
                )}
            </div>
        </main >


    )
}
