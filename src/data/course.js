import  CourseData  from './courses.json';

export function fetchCourseBySlug(slug) {
    return CourseData.find((course) => course.slug === slug);
}

export function fetchCourses() {
    return CourseData;
}

export function getThreeCourses() {
    return CourseData.slice(0, 3);
}

export function paginate(page, competency = false) {
    const coursesPerPage = 6;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = page * coursesPerPage;
    
    // Cursos prioritários
    const prioritySlugs = ["eletrotecnica", "mecanica", "seguranca-do-trabalho"];
    
    // Separar cursos prioritários e outros
    const priorityCourses = CourseData.filter(course => prioritySlugs.includes(course.slug));
    const otherCourses = CourseData.filter(course => !prioritySlugs.includes(course.slug));
    
    // Ordenar cursos prioritários pela ordem especificada
    const orderedPriorityCourses = prioritySlugs
        .map(slug => priorityCourses.find(course => course.slug === slug))
        .filter(Boolean);
    
    // Combinar cursos ordenados
    const sortedCourses = [...orderedPriorityCourses, ...otherCourses];
    
    if (competency) {
        return sortedCourses.filter(course => course.competency).slice(startIndex, endIndex);
    }
    return sortedCourses.slice(startIndex, endIndex);
}

export function getCourseCount(competency = false) {
    if (competency) {
        return CourseData.filter(course => course.competency).length;
    }
    return CourseData.length;
}

export function getCourseByName(name) {
    let courses = [];
    if (!name) return null;
    function normalizeForCompare(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '') 
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
    const cleanName = normalizeForCompare(name);
    CourseData.map(course => {
        if (normalizeForCompare(course.nome).includes(cleanName)) {
            courses.push(course);
        }
    });
    return courses;
}

export function getHighRatedCourses(courses) {
   if (!Array.isArray(courses)) {
    return [];
   }
   const mapped = courses.map(slug => {
       return CourseData.find(course => course.slug === slug);
   });
   return mapped;
}

export function getCompetencyCourses() {
    return CourseData.filter(course => course.competency);
}
