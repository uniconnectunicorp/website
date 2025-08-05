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