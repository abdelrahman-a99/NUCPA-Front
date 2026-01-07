"use client";

import { useState, useRef, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CARDS } from "@/lib/data";

export default function Details() {
  const [active, setActive] = useState<typeof CARDS[number]["key"]>(CARDS[0].key);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentIndex = CARDS.findIndex((c) => c.key === active);
    if (currentIndex !== -1) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const cardWidth = isMobile ? 160 : 220;
      const gap = 32;
      const padding = 16;

      const scrollTarget = currentIndex * (cardWidth + gap);

      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth",
      });
    }
  }, [active]);

  const handlePrev = () => {
    const currentIndex = CARDS.findIndex((c) => c.key === active);
    const prevIndex = (currentIndex - 1 + CARDS.length) % CARDS.length;
    setActive(CARDS[prevIndex].key);
  };

  const handleNext = () => {
    const currentIndex = CARDS.findIndex((c) => c.key === active);
    const nextIndex = (currentIndex + 1) % CARDS.length;
    setActive(CARDS[nextIndex].key);
  };

  return (
    <section id="details">
      <div className="container-max py-16">
        <SectionHeader title="DETAILS" />
        <div className="mt-10">
          <p className="font-pixel text-[14px] lg:text-[20px] px-4 lg:px-0 text-red">COMPETITION OVERVIEW</p>

          {/* Cards Container */}
          <div
            ref={containerRef}
            className="mt-5 flex gap-8 overflow-x-auto pb-8 scrollbar-hide px-4 -mx-4 scroll-smooth"
          >
            {CARDS.map((card) => {
              const isActive = card.key === active;
              return (
                <button
                  key={card.key}
                  data-active={isActive}
                  onClick={() => setActive(card.key)}
                  className={cn(
                    "relative flex flex-col transition-all duration-500 shrink-0",
                    "text-left p-4 sm:p-8 rounded-xl2 shadow-soft",
                    isActive
                      ? "w-[280px] sm:w-[500px] bg-teal justify-end min-h-[400px] sm:min-h-[450px] h-auto"
                      : "w-[160px] sm:w-[220px] bg-teal2 justify-end h-[400px] sm:h-[450px] hover:opacity-90"
                  )}
                >
                  {/* Title */}
                  <div
                    className={cn(
                      "font-pixel text-md sm:text-2xl uppercase leading-relaxed transition-all duration-500 break-words",
                      isActive ? "mb-0 lg:mb-4 text-white" : "text-white/90"
                    )}
                  >
                    {card.title}
                  </div>

                  {/* Body - Only visible when active */}
                  <div
                    className={cn(
                      "transition-opacity duration-300 overflow-hidden pr-2",
                      isActive
                        ? "opacity-100 visible h-auto mt-4"
                        : "opacity-0 invisible h-0"
                    )}
                  >
                    <p className="text-sm sm:text-[18px] font-semibold text-ink leading-relaxed font-sans">
                      {card.body}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="px-4 lg:px-0 mt-0 lg:mt-4 text-sm lg:text-lg text-ink2 font-semibold">
            Answers to common questions regarding
            <br />
            competition details
          </p>

          <div className="px-4 lg:px-0 mt-2 lg:mt-4 flex gap-3">
            <button
              onClick={handlePrev}
              className="h-8 w-8 rounded-full bg-red text-white grid place-items-center hover:bg-red/90 transition"
              aria-label="Previous Detail"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <button
              onClick={handleNext}
              className="h-8 w-8 rounded-full bg-red text-white grid place-items-center hover:bg-red/90 transition"
              aria-label="Next Detail"
            >
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
