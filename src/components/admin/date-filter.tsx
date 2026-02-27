"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DateFilterProps {
  onChange: (range: { start: string; end: string } | null) => void;
}

const presets = [
  { label: "Hoje", getValue: () => { const d = fmt(new Date()); return { start: d, end: d }; } },
  { label: "7 dias", getValue: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 6); return { start: fmt(s), end: fmt(e) }; } },
  { label: "30 dias", getValue: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 29); return { start: fmt(s), end: fmt(e) }; } },
  { label: "Este mês", getValue: () => { const n = new Date(); return { start: fmt(new Date(n.getFullYear(), n.getMonth(), 1)), end: fmt(n) }; } },
  { label: "Mês passado", getValue: () => { const n = new Date(); return { start: fmt(new Date(n.getFullYear(), n.getMonth() - 1, 1)), end: fmt(new Date(n.getFullYear(), n.getMonth(), 0)) }; } },
];

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function DateFilter({ onChange }: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Este mês");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (label: string, range: { start: string; end: string }) => {
    setActive(label);
    setShowCustom(false);
    setOpen(false);
    onChange(range);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setActive(`${customStart.split("-").reverse().join("/")} - ${customEnd.split("-").reverse().join("/")}`);
      setOpen(false);
      onChange({ start: customStart, end: customEnd });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{active}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-40 py-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p.label, p.getValue())}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  active === p.label
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                showCustom ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Personalizado
            </button>
            {showCustom && (
              <div className="px-4 py-3 space-y-2 border-t border-gray-100">
                <label className="block">
                  <span className="text-xs text-gray-500">Início</span>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Fim</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </label>
                <button
                  onClick={handleCustomApply}
                  disabled={!customStart || !customEnd}
                  className="w-full py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
