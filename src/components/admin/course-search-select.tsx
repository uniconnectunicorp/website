"use client";

import { useEffect, useState } from "react";
import {
  detectModalityFromCourse,
  getCoursesForModality,
  isCourseValidForModality,
  MODALITIES,
  normalizeCourseForModality,
  SINGLE_COURSE,
} from "@/lib/course-modalities";

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
    return detectModalityFromCourse(value);
  });

  useEffect(() => {
    const nextModality = initialModality || detectModalityFromCourse(value);
    setModality(nextModality);
  }, [initialModality, value]);

  const courses = getCoursesForModality(modality);

  const handleModalityChange = (newModality: string) => {
    setModality(newModality);
    const normalizedCurrentCourse = normalizeCourseForModality(value, newModality);

    if (normalizedCurrentCourse && isCourseValidForModality(normalizedCurrentCourse, newModality)) {
      onChange(normalizedCurrentCourse, newModality);
      return;
    }

    if (SINGLE_COURSE[newModality]) {
      onChange(SINGLE_COURSE[newModality], newModality);
      return;
    }

    onChange("", newModality);
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
