import { cn } from "@/lib/cn";

type Variant = "primary" | "outline-red" | "ghost";

export default function PixelButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "default",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "default" | "sm";
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-full transition shadow-soft";

  const sizes = {
    default: "text-sm lg:text-[20px] px-6 lg:px-12 py-2.5 lg:py-4",
    sm: "text-sm px-6 py-2.5",
  };

  const styles: Record<Variant, string> = {
    primary: "bg-teal text-white hover:opacity-90",
    "outline-red":
      "bg-transparent text-red border-2 border-red hover:bg-red hover:text-white shadow-none",
    ghost: "bg-transparent text-ink hover:bg-white border border-line shadow-none",
  };

  const Comp: any = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(base, sizes[size], styles[variant], className)}
    >
      {children}
    </Comp>
  );
}
