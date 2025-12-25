"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { NAV_ITEMS } from "@/lib/site";
import { cn } from "@/lib/cn";

export default function Navbar() {
  const [active, setActive] = useState<string>("#home");

  const ids = useMemo(() => NAV_ITEMS.map((i) => i.href.replace("#", "")), []);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120; // offset for navbar
      let current = "#home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (scrollY >= top) {
          current = `#${id}`;
        }
      }
      setActive(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);

  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur border-b border-line">
      <div className="container-max h-24 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          {/* Logo */}
          <Image
            src="/assets/logo.png"
            alt="NUCPA"
            width={120}
            height={64}
            className="h-16 w-auto"
            priority
          />
        </a>

        <nav className="hidden md:flex items-center gap-10 text-[14px]">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === active;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "px-8 py-2 rounded-full transition border",
                  isActive
                    ? "bg-teal text-white border-transparent shadow-soft"
                    : "bg-transparent text-ink border-transparent hover:bg-white hover:border-line"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="#contact"
          className="md:hidden text-[11px] px-3 py-2 rounded-full bg-white border border-line"
        >
          MENU
        </a>
      </div>
    </header>
  );
}
