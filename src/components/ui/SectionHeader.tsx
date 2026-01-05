import { cn } from "@/lib/cn";

export default function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <h2 className="font-pixel text-2xl sm:text-3xl text-ink2 tracking-wide">{title}</h2>
      {subtitle ? (
        <p className="mt-2 lg:mt-4 text-sm lg:text-lg text-muted font-semibold max-w-2xl mx-auto">{subtitle}</p>
      ) : null}
    </div>
  );
}
