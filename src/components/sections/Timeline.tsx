import { cn } from "@/lib/cn";
import { TIMELINE_ITEMS } from "@/lib/data";

export default function Timeline() {
  const currentDate = new Date("2025-12-25");

  return (
    <section className="bg-bg">
      <div className="container-max py-16">
        <p className="font-pixel text-[20px] text-red">COMPETITION TIMELINE</p>

        <div className="mt-16 sm:mt-24 relative">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden sm:block absolute top-1/2 left-[12.5%] w-[75%] h-[2px] bg-line -translate-y-1/2" />

          {/* Vertical Line (Mobile) */}
          <div className="block sm:hidden absolute left-[11px] top-0 bottom-0 w-[2px] bg-line" />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-0">
            {TIMELINE_ITEMS.map((it, idx) => {
              const cleanDate = it.date.replace(/(st|nd|rd|th),/g, ",");
              const itemDate = new Date(cleanDate);

              const isPast = itemDate < currentDate;
              const isEven = idx % 2 === 0;
              const isLast = idx === TIMELINE_ITEMS.length - 1;

              return (
                <div key={it.title} className="relative flex sm:justify-center">
                  {/* Container for Dot + Text */}
                  <div className="flex flex-row sm:flex-col items-start sm:items-center w-full relative h-auto sm:h-32 justify-start sm:justify-center">

                    {/* Dot */}
                    <div
                      className={cn(
                        "relative z-10 h-8 w-8 rounded-full border-4 shrink-0 transition-colors duration-300",
                        isPast ? "bg-red border-red" : "bg-teal2 border-teal2",
                        "sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
                      )}
                    />

                    {/* Text Block */}
                    <div
                      className={cn(
                        "my-6 ml-6 sm:ml-0 flex flex-col sm:items-center",
                        "sm:absolute sm:w-64 sm:text-center",
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
                            className="hidden sm:block absolute -left-16 top-7 -translate-y-1/2 w-24 h-auto pixelated select-none"
                          />
                        )}
                        <div className="font-pixel text-[13px] sm:text-[18px] leading-tight">
                          {it.title}
                        </div>
                      </div>

                      <div className="mt-1 font-sans text-ms text-muted">
                        {it.date}
                      </div>

                      {/* Mobile Balloon Fallback */}
                      {isLast && (
                        <img
                          src="/assets/ballon_pink.png"
                          alt=""
                          className="block sm:hidden mt-2 w-10 h-auto pixelated select-none"
                        />
                      )}
                    </div>
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
