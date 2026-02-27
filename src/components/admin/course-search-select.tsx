"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import coursesData from "@/data/courses.json";

const courseNames = coursesData.map((c: any) => c.nome);

interface CourseSearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CourseSearchSelect({ value, onChange, placeholder = "Selecionar curso..." }: CourseSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = courseNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-left"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="p-0.5 hover:bg-gray-100 rounded"
            >
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          )}
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar curso..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length > 0 ? (
              filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); setSearch(""); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 ${
                    value === name ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
                  }`}
                >
                  {name}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">Nenhum curso encontrado</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
