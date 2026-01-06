import React from "react";

export default function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-pixel text-muted uppercase tracking-wider ml-1">{label}</span>
        {children}
      </label>
      {error && (
        <span className="text-[10px] font-pixel text-red ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
}
