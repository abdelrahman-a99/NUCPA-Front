import React from "react";

export default function InfoRow({
  label,
  value,
  compact,
  large,
  highlight,
  variant,
}: {
  label: string;
  value: string;
  compact?: boolean;
  large?: boolean;
  highlight?: boolean;
  variant?: "success" | "warning" | "error" | "info";
}) {
  const getVariantClass = () => {
    switch (variant) {
      case "success": return "text-teal font-bold";
      case "warning": return "text-yellow-600 font-bold";
      case "error": return "text-red font-bold";
      case "info": return "text-blue-600 font-bold";
      default: return highlight ? "text-teal font-bold" : "text-ink font-medium";
    }
  };

  return (
    <div className={compact ? "flex justify-between items-baseline gap-4 py-1" : "flex flex-col gap-1"}>
      <span className={`text-muted shrink-0 ${compact ? "text-[10px]" : "text-[10px] uppercase tracking-wide font-bold"}`}>{label}</span>
      <span className={`truncate ${large ? "text-lg sm:text-xl" : "text-sm uppercase"} ${getVariantClass()} ${compact ? "text-right ml-2" : ""}`}>
        {value}
      </span>
    </div>
  );
}
