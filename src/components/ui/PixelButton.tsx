import { cn } from "@/lib/cn";

type Variant = "primary" | "outline-red" | "ghost";

export default function PixelButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center font-bold text-[20px] px-12 py-4 rounded-full transition shadow-soft";

  const styles: Record<Variant, string> = {
    primary: "bg-teal text-white hover:opacity-90",
    "outline-red":
      "bg-transparent text-red border-4 border-red hover:bg-red hover:text-white shadow-none",
    ghost: "bg-transparent text-ink hover:bg-white border border-line shadow-none",
  };

  const Comp: any = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(base, styles[variant], className)}
    >
      {children}
    </Comp>
  );
}
