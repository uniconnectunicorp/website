"use client";

import { useState } from "react";
import regularCoursesData from "@/data/courses.json";
import competenciaCoursesData from "@/data/competencia-courses.json";
import sequentialCoursesData from "@/data/sequential-courses.json";

const regularCourses = (regularCoursesData as any[]).map((c) => c.nome).sort();
const aproveitamentoCourses = (regularCoursesData as any[]).filter((c) => c.aproveitamento).map((c) => c.nome).sort();
const competenciaCourses = (competenciaCoursesData as any[]).map((c) => c.nome).sort();
const sequentialCourses = (sequentialCoursesData as any[]).map((c) => c.nome).sort();

const EJA_OPTIONS = [
  "EJA - Ensino Fundamental",
  "EJA - Ensino Médio",
];

const INGLES_OPTIONS = [
  "Inglês Básico",
  "Inglês Intermediário",
  "Inglês Avançado",
];

const MODALITIES = [
  { value: "regular", label: "Regular" },
  { value: "aproveitamento", label: "Aproveitamento" },
  { value: "competencia", label: "Competência" },
  { value: "sequencial", label: "Sequencial" },
  { value: "eja", label: "EJA" },
  { value: "ingles", label: "Inglês" },
];

// Modalidades com curso único (não precisam de segundo select)
const SINGLE_COURSE: Record<string, string> = {
  eja: "EJA",
  ingles: "Inglês",
};

function getCoursesForModality(modality: string): string[] {
  switch (modality) {
    case "regular": return regularCourses;
    case "aproveitamento": return aproveitamentoCourses;
    case "competencia": return competenciaCourses;
    case "sequencial": return sequentialCourses;
    case "eja": return EJA_OPTIONS;
    case "ingles": return INGLES_OPTIONS;
    default: return [];
  }
}

interface CourseSearchSelectProps {
  value: string;
  onChange: (value: string, modality?: string) => void;
  initialModality?: string;
  placeholder?: string;
}

export function CourseSearchSelect({
  value,
  onChange,
  initialModality = "",
  placeholder = "Selecionar curso...",
}: CourseSearchSelectProps) {
  const [modality, setModality] = useState<string>(() => {
    if (initialModality) return initialModality;
    if (!value) return "";
    // Try to detect modality from value
    if (regularCourses.includes(value)) return "regular";
    if (competenciaCourses.includes(value)) return "competencia";
    if (sequentialCourses.includes(value)) return "sequencial";
    if (EJA_OPTIONS.includes(value)) return "eja";
    if (INGLES_OPTIONS.includes(value)) return "ingles";
    return "regular";
  });

  const courses = getCoursesForModality(modality);

  const handleModalityChange = (newModality: string) => {
    setModality(newModality);
    if (SINGLE_COURSE[newModality]) {
      onChange(SINGLE_COURSE[newModality], newModality);
    } else {
      onChange("", newModality);
    }
  };

  const handleCourseChange = (course: string) => {
    onChange(course, modality);
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white";

  return (
    <div className="space-y-2">
      {/* Modalidade */}
      <select
        value={modality}
        onChange={(e) => handleModalityChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Selecionar modalidade...</option>
        {MODALITIES.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      {/* Curso (só aparece para modalidades com múltiplos cursos) */}
      {modality && !SINGLE_COURSE[modality] && (
        <select
          value={value}
          onChange={(e) => handleCourseChange(e.target.value)}
          className={inputClass}
        >
          <option value="">{placeholder}</option>
          {courses.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      )}
      {/* Para modalidade de curso único, mostra o curso selecionado */}
      {modality && SINGLE_COURSE[modality] && (
        <p className="px-4 py-2 text-sm text-gray-500 bg-gray-50 rounded-xl">
          Curso: <span className="font-medium text-gray-700">{SINGLE_COURSE[modality]}</span>
        </p>
      )}
    </div>
  );
}
