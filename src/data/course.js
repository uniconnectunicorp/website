import  CourseData  from './courses.json';
import  CompetenciaCourseData  from './competencia-courses.json';
import  SequentialCourseData  from './sequential-courses.json';

export function fetchCourseBySlug(slug) {
    return CourseData.find((course) => course.slug === slug);
}

export function fetchCourses() {
    return CourseData;
}

export function fetchCoursesForDisplay() {
    return CourseData.filter(course => !course.enrollmentOnly);
}

export function getThreeCourses() {
    return CourseData.filter(course => !course.enrollmentOnly).slice(0, 3);
}

export function paginate(page, aproveitamento = false) {
    const coursesPerPage = 6;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = page * coursesPerPage;
    
    // Filtrar cursos que não são enrollmentOnly
    const displayCourses = CourseData.filter(course => !course.enrollmentOnly);
    
    // Cursos prioritários
    const prioritySlugs = ["eletrotecnica", "mecanica", "seguranca-do-trabalho"];
    
    // Separar cursos prioritários e outros
    const priorityCourses = displayCourses.filter(course => prioritySlugs.includes(course.slug));
    const otherCourses = displayCourses.filter(course => !prioritySlugs.includes(course.slug));
    
    // Ordenar cursos prioritários pela ordem especificada
    const orderedPriorityCourses = prioritySlugs
        .map(slug => priorityCourses.find(course => course.slug === slug))
        .filter(Boolean);
    
    // Combinar cursos ordenados
    const sortedCourses = [...orderedPriorityCourses, ...otherCourses];
    
    if (aproveitamento) {
        return sortedCourses.filter(course => course.aproveitamento).slice(startIndex, endIndex);
    }
    return sortedCourses.slice(startIndex, endIndex);
}

export function getCourseCount(aproveitamento = false) {
    const displayCourses = CourseData.filter(course => !course.enrollmentOnly);
    if (aproveitamento) {
        return displayCourses.filter(course => course.aproveitamento).length;
    }
    return displayCourses.length;
}

export function getCourseByName(name, aproveitamento = false) {
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
    const source = aproveitamento
        ? CourseData.filter(c => c.aproveitamento && !c.enrollmentOnly)
        : CourseData.filter(c => !c.enrollmentOnly);
    source.forEach(course => {
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

export function getAproveitamentoCourses() {
    return CourseData.filter(course => course.aproveitamento && !course.enrollmentOnly);
}

// Competência courses helpers
export function fetchCompetenciaCourses() {
    return CompetenciaCourseData;
}

export function fetchCompetenciaCourseBySlug(slug) {
    return CompetenciaCourseData.find((course) => course.slug === slug);
}

export function getCompetenciaCourseCount() {
    return CompetenciaCourseData.length;
}

export function paginateCompetencia(page) {
    const coursesPerPage = 12;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = page * coursesPerPage;
    return CompetenciaCourseData.slice(startIndex, endIndex);
}

export function getCompetenciaCourseByName(name) {
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
    CompetenciaCourseData.map(course => {
        if (normalizeForCompare(course.nome).includes(cleanName)) {
            courses.push(course);
        }
    });
    return courses;
}

export function getAllCompetenciaCourses() {
    return CompetenciaCourseData;
}

export function fetchAllCoursesForEnrollment() {
    const regular = CourseData.map(c => ({ nome: c.nome, slug: c.slug, tipo: 'Técnico Regular' }));
    const aproveitamento = CourseData.filter(course => course.aproveitamento).map(c => ({ nome: `${c.nome} (Aproveitamento)`, slug: `aproveitamento-${c.slug}`, tipo: 'Aproveitamento' }));
    const competencia = CompetenciaCourseData.map(c => ({ nome: `${c.nome} (Competência)`, slug: `competencia-${c.slug}`, tipo: 'Competência' }));
    const sequencial = SequentialCourseData.map(c => ({ nome: c.nome, slug: c.slug, tipo: 'Sequencial' }));
    const outros = [
        { nome: 'EJA - Educação de Jovens e Adultos', slug: 'eja', tipo: 'EJA' },
        { nome: 'Curso de Inglês', slug: 'ingles', tipo: 'Inglês' },
    ];
    return [...regular, ...aproveitamento, ...competencia, ...sequencial, ...outros];
}
