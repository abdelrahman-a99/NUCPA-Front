"use client";

import Image from "next/image";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AWARD_TABS, PRIZES } from "@/lib/data";

type TabKey = (typeof AWARD_TABS)[number]["key"];

export default function Awards() {
  const [tab, setTab] = useState<TabKey>(AWARD_TABS[0].key);
  const [idx, setIdx] = useState(0);

  const currentPrizes = PRIZES[tab];
  const prize = useMemo(() => currentPrizes[idx] ?? currentPrizes[0], [currentPrizes, idx]);

  const handleTabChange = (key: TabKey) => {
    setTab(key);
    setIdx(0);
  };

  return (
    <section>
      <div className="container-max py-16">
        <p className="font-pixel text-[14px] lg:text-[20px] text-red px-4 lg:px-0">COMPETITION AWARDS</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-8 items-center">
          <div className="space-y-3 lg:space-y-6 px-4 lg:px-0">
            {AWARD_TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={cn(
                    "w-full text-center px-2 lg:px-18 py-3 sm:py-4 rounded-full font-pixel text-[8px] sm:text-xl transition-all duration-200 border",
                    active
                      ? "bg-red/5 border-red text-red shadow-sm"
                      : "bg-transparent border-teal-bright text-teal-bright hover:bg-teal-bright/5"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="relative flex flex-col items-center justify-center py-12">
              <h3 className="font-pixel text-xs sm:text-3xl mb-8">{prize.title}</h3>

              <div className="flex items-center">
                {/* Prev Arrow */}
                {currentPrizes.length > 1 && (
                  <button
                    onClick={() =>
                      setIdx(
                        (p) => (p - 1 + currentPrizes.length) % currentPrizes.length
                      )
                    }
                    className="text-ink hover:text-teal transition-transform hover:scale-110"
                    aria-label="Previous Prize"
                  >
                    <ChevronLeft className="w-8 h-8 lg:w-20 lg:h-20" strokeWidth={3} />
                  </button>
                )}

                {/* Prizes */}
                <div className="flex items-center gap-0 sm:gap-10">
                  {prize.images.map((src, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <Image
                        src={src}
                        alt="Prize"
                        width={240}
                        height={240}
                        className="w-28 sm:w-60 h-auto pixelated drop-shadow-md select-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Next Arrow */}
                {currentPrizes.length > 1 && (
                  <button
                    onClick={() => setIdx((p) => (p + 1) % currentPrizes.length)}
                    className="text-ink hover:text-teal transition-transform hover:scale-110"
                    aria-label="Next Prize"
                  >
                    <ChevronRight className="w-8 h-8 lg:w-20 lg:h-20" strokeWidth={3} />
                  </button>
                )}
              </div>

              <p className="mt-8 font-pixel text-[10px] sm:text-lg">
                {prize.caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
