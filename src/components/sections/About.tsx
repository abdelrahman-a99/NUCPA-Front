"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STATS, ABOUT_GALLERY, SPONSORS } from "@/lib/data";

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ABOUT_GALLERY.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ABOUT_GALLERY.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + ABOUT_GALLERY.length) % ABOUT_GALLERY.length
    );
  };

  return (
    <section id="about" className="bg-dots-about">
      <div className="container-max py-12">
        <SectionHeader
          title="ABOUT NUCPA"
          subtitle="NUCPA, Nile University Competitive Programming Arena, is the largest student-led national programming competition for Students in Egypt."
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          <span className="px-8 sm:px-8 py-1.5 rounded-full bg-red text-white font-semibold text-sm sm:text-[16px] shadow-sm">
            2025
          </span>
          <span className="text-sm sm:text-[16px] font-semibold tracking-wide text-ink">
            COMING SOON
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Gallery Slider */}
          <div className="lg:col-span-2 relative px-8 sm:px-12">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 text-ink hover:text-teal transition z-10"
            >
              <ChevronLeft size={32} className="sm:w-10 sm:h-10" strokeWidth={3} />
            </button>

            <div className="relative bg-white border border-line rounded-xl2 shadow-soft overflow-hidden group aspect-video">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,177,192,.08),rgba(255,77,92,.05))]" />

              <div className="relative w-full h-full">
                <Image
                  src={ABOUT_GALLERY[currentSlide]}
                  alt={`Gallery Image ${currentSlide + 1}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority={currentSlide === 0}
                />
              </div>
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 text-ink hover:text-teal transition z-10"
            >
              <ChevronRight size={32} className="sm:w-10 sm:h-10" strokeWidth={3} />
            </button>
          </div>

          {/* Stats */}
          <div className="pl-0 lg:pl-8 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:space-y-12">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center lg:justify-start gap-4 sm:gap-6 group bg-white/40 p-4 rounded-2xl border border-line/20 lg:bg-transparent lg:p-0 lg:border-none">
                  <div className="text-teal transition-transform group-hover:scale-110 duration-300 shrink-0">
                    <s.Icon className={`${s.iconClass} w-8 h-8 sm:w-8 sm:h-8 md:w-16 md:h-16`} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-pixel text-md sm:text-2xl text-teal">
                      {s.value} <span className="text-teal">{s.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="mt-14 overflow-hidden">
          <h3 className="text-center font-pixel text-2xl sm:text-4xl mb-8">OUR SPONSORS</h3>

          <div className="relative w-full pb-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-max animate-scroll gap-4 sm:gap-6">
              {[...SPONSORS, ...SPONSORS].map((src, i) => (
                <div
                  key={i}
                  className="h-24 sm:h-40 w-40 sm:w-64 shrink-0 bg-transparent flex items-center justify-center p-4 sm:p-8"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt="Sponsor Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
