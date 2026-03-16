import regularCoursesData from "@/data/courses.json";
import competenciaCoursesData from "@/data/competencia-courses.json";
import sequentialCoursesData from "@/data/sequential-courses.json";

export const EJA_OPTIONS = [
  "EJA - Educação de Jovens e Adultos",
  "EJA - Ensino Fundamental",
  "EJA - Ensino Médio",
] as const;

export const INGLES_OPTIONS = [
  "Inglês Básico",
  "Inglês Intermediário",
  "Inglês Avançado",
] as const;

export const MODALITIES = [
  { value: "regular", label: "Regular" },
  { value: "aproveitamento", label: "Aproveitamento" },
  { value: "competencia", label: "Competência" },
  { value: "sequencial", label: "Sequencial" },
  { value: "eja", label: "EJA" },
  { value: "ingles", label: "Inglês" },
] as const;

export const MODALITY_LABELS: Record<string, string> = Object.fromEntries(
  MODALITIES.map((modality) => [modality.value, modality.label])
);

export const SINGLE_COURSE: Record<string, string> = {
  eja: "EJA",
  ingles: "Inglês",
};

const regularCourses = (regularCoursesData as any[]).map((c) => c.nome).sort();
const aproveitamentoCourses = (regularCoursesData as any[])
  .filter((c) => c.aproveitamento)
  .map((c) => c.nome)
  .sort();
const competenciaCourses = (competenciaCoursesData as any[]).map((c) => c.nome).sort();
const sequentialCourses = (sequentialCoursesData as any[]).map((c) => c.nome).sort();

export function getCoursesForModality(modality: string): string[] {
  switch (modality) {
    case "regular":
      return regularCourses;
    case "aproveitamento":
      return aproveitamentoCourses;
    case "competencia":
      return competenciaCourses;
    case "sequencial":
      return sequentialCourses;
    case "eja":
      return [...EJA_OPTIONS];
    case "ingles":
      return [...INGLES_OPTIONS];
    default:
      return [];
  }
}

export function detectModalityFromCourse(course?: string | null) {
  if (!course) return "";
  if (competenciaCourses.includes(course)) return "competencia";
  if (sequentialCourses.includes(course)) return "sequencial";
  if (EJA_OPTIONS.includes(course as (typeof EJA_OPTIONS)[number])) return "eja";
  if (INGLES_OPTIONS.includes(course as (typeof INGLES_OPTIONS)[number])) return "ingles";
  if (aproveitamentoCourses.includes(course)) return "aproveitamento";
  if (regularCourses.includes(course)) return "regular";
  return "";
}

export function resolveLeadModality(course?: string | null, modalidade?: string | null) {
  const detectedModality = detectModalityFromCourse(course);
  if (detectedModality && detectedModality !== modalidade) {
    return detectedModality;
  }
  return modalidade || detectedModality;
}

export function isCourseValidForModality(course: string, modality: string) {
  if (!course || !modality) return false;

  if (SINGLE_COURSE[modality]) {
    return course === SINGLE_COURSE[modality];
  }

  return getCoursesForModality(modality).includes(course);
}

export function normalizeCourseForModality(course: string, modality: string) {
  if (!modality) return course;
  if (SINGLE_COURSE[modality]) return SINGLE_COURSE[modality];
  return course;
}
