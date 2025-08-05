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

export function paginate(page) {
    const coursesPerPage = 6;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = page * coursesPerPage;
    return CourseData.slice(startIndex, endIndex);
}

export function getCourseCount() {
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