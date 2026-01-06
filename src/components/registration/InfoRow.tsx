import React from "react";

export default function InfoRow({
  label,
  value,
  compact,
  large,
  highlight,
}: {
  label: string;
  value: string;
  compact?: boolean;
  large?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={compact ? "flex justify-between items-baseline gap-4 py-1" : "flex flex-col gap-1"}>
      <span className={`text-muted shrink-0 ${compact ? "text-[10px]" : "text-[10px] uppercase tracking-wide"}`}>{label}</span>
      <span className={`text-ink truncate ${large ? "text-lg sm:text-xl" : "text-sm uppercase"} ${highlight ? "text-teal font-bold" : ""} ${compact ? "text-right ml-2" : ""}`}>
        {value}
      </span>
    </div>
  );
}
