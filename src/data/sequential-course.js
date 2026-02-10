import SequentialCourseData from './sequential-courses.json';

export function fetchSequentialCourseBySlug(slug) {
    return SequentialCourseData.find((course) => course.slug === slug);
}

export function fetchSequentialCourses() {
    return SequentialCourseData;
}

export function getSequentialCourseCount() {
    return SequentialCourseData.length;
}

export function paginateSequential(page) {
    const coursesPerPage = 6;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = page * coursesPerPage;
    return SequentialCourseData.slice(startIndex, endIndex);
}

export function getSequentialCourseByName(name) {
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
    SequentialCourseData.map(course => {
        if (normalizeForCompare(course.nome).includes(cleanName)) {
            courses.push(course);
        }
    });
    return courses;
}
