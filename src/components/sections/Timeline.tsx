import { cn } from "@/lib/cn";
import { TIMELINE_ITEMS } from "@/lib/data";

export default function Timeline() {
  const currentDate = new Date();

  const n = TIMELINE_ITEMS.length;
  // Center of first dot: 1/(2n), Center of last dot: (2n-1)/(2n). Width = (n-1)/n. LeftOffset = 1/(2n).
  const leftOffset = `${(1 / (2 * n)) * 100}%`;
  const lineWidth = `${((n - 1) / n) * 100}%`;

  return (
    <section className="bg-bg">
      <div className="container-max py-16">
        <p className="font-pixel text-[14px] lg:text-[20px] text-red px-4 lg:px-0">COMPETITION TIMELINE</p>

        <div className="mt-16 sm:mt-24 relative">
          {/* Horizontal Line (Desktop) */}
          <div
            className="hidden sm:block absolute top-1/2 h-[2px] bg-line -translate-y-1/2"
            style={{ left: leftOffset, width: lineWidth }}
          />

          {/* Vertical Line (Mobile) */}
          <div className="block sm:hidden absolute left-1/2 top-0 bottom-0 w-[2px] bg-line -translate-x-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-12 sm:gap-0">
            {TIMELINE_ITEMS.map((it, idx) => {
              const cleanDate = it.date.replace(/(st|nd|rd|th),/g, ",");
              const itemDate = new Date(cleanDate);

              const isPast = itemDate < currentDate;
              const isEven = idx % 2 === 0;
              const isLast = idx === TIMELINE_ITEMS.length - 1;

              return (
                <div key={it.title} className="relative flex sm:justify-center">
                  {/* Container for Dot + Text */}
                  <div className={cn(
                    "flex sm:flex-col items-center sm:items-center w-full relative h-auto sm:h-32 justify-center sm:justify-center",
                    // Mobile alternating: even items (idx 0, 2...) on left, odd items on right
                    isEven ? "flex-row" : "flex-row-reverse"
                  )}>

                    {/* Content Block (Left or Right on mobile) */}
                    <div
                      className={cn(
                        "flex flex-col w-[calc(50%-20px)] sm:w-64",
                        "sm:absolute sm:text-center sm:ml-0 sm:my-4",
                        // Mobile alignment
                        isEven ? "text-right pr-4" : "text-left pl-4",
                        // Desktop positioning
                        isEven ? "sm:bottom-[60%]" : "sm:top-[60%]"
                      )}
                    >
                      {/* Title + Balloon Wrapper */}
                      <div className="relative">
                        {isLast && (
                          <img
                            src="/assets/ballon_pink.png"
                            alt=""
                            className={cn(
                              "absolute -top-12 sm:top-7 -translate-y-1/2 w-16 sm:w-24 h-auto pixelated select-none",
                              // Desktop balloon
                              "sm:-left-16",
                              // Mobile balloon
                              isEven ? "left-0" : "right-0 top-10"
                            )}
                          />
                        )}
                        <div className="font-pixel text-[11px] sm:text-[18px] leading-tight">
                          {it.title}
                        </div>
                      </div>

                      <div className="mt-1 font-sans text-[10px] sm:text-[16px] text-muted">
                        {it.date}
                      </div>
                    </div>

                    {/* Dot */}
                    <div
                      className={cn(
                        "relative z-10 h-8 w-8 rounded-full border-4 shrink-0 transition-colors duration-300",
                        isPast ? "bg-red border-red" : "bg-teal2 border-teal2",
                        "sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
                      )}
                    />

                    {/* Spacer for the other side on mobile */}
                    <div className="w-[calc(50%-20px)] sm:hidden" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
