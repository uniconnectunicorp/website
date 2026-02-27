"use client";

import { Phone, User, Calendar } from "lucide-react";

interface LeadCardProps {
  lead: {
    id: string;
    name: string;
    phone: string;
    course?: string | null;
    createdAt: string;
  };
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-all space-y-2"
    >
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-400 shrink-0" />
        <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <p className="text-xs text-gray-500">{lead.phone}</p>
      </div>
      {lead.course && (
        <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1 truncate">
          {lead.course}
        </p>
      )}
      <div className="flex items-center gap-1 text-[11px] text-gray-400">
        <Calendar className="h-3 w-3" />
        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
      </div>
    </div>
  );
}
