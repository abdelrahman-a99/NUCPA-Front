"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/site";
import { cn } from "@/lib/cn";

export default function Navbar() {
  const [active, setActive] = useState<string>("#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  const ids = useMemo(() => NAV_ITEMS.map((i) => i.href.replace("#", "")), []);

  useEffect(() => {
    if (!isHome) {
      setActive("");
      return;
    }

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
  }, [ids, isHome]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      window.location.reload(); // Force refresh to clear states
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="container-max h-20 md:h-24 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          {/* Logo */}
          <Image
            src="/assets/logo.png"
            alt="NUCPA"
            width={120}
            height={64}
            className="h-12 md:h-16 w-auto"
            priority
          />
        </a>

        <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[14px]">
          {NAV_ITEMS.map((item) => {
            const isActive = isHome && item.href === active;
            const href = isHome ? item.href : `/${item.href}`;
            return (
              <a
                key={item.href}
                href={href}
                className={cn(
                  "px-6 lg:px-8 py-2 rounded-full transition border text-center min-w-max",
                  isActive
                    ? "bg-teal text-white border-transparent shadow-soft"
                    : "bg-bg/40 text-ink border-transparent hover:bg-white hover:border-line"
                )}
              >
                {item.label}
              </a>
            );
          })}
          {!isHome && pathname.startsWith("/registration") && (
            <button
              onClick={handleLogout}
              className="px-6 lg:px-8 py-2 rounded-full bg-red/10 text-red border border-red/20 font-bold hover:bg-red hover:text-white transition shadow-sm"
            >
              LOGOUT
            </button>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-3">
          {!isHome && pathname.startsWith("/registration") && (
            <button
              onClick={handleLogout}
              className="text-[11px] px-3 py-2 rounded-full bg-red text-white font-bold"
            >
              LOGOUT
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-[12px] mr-2 px-4 py-2 rounded-full bg-white hover:bg-red hover:text-white transition border border-line font-bold uppercase tracking-wider"
          >
            MENU
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-[100] transition-opacity duration-300 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar content */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[240px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col p-6",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-end mb-10 shrink-0">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-line/20 text-ink hover:bg-line/40 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4 items-start">
            {NAV_ITEMS.map((item) => {
              const href = isHome ? item.href : `/${item.href}`;
              const isActive = isHome && item.href === active;
              return (
                <a
                  key={item.href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-sm font-semibold py-3 px-6 rounded-xl transition-all w-full text-left",
                    isActive
                      ? "bg-teal text-white shadow-md"
                      : "text-ink bg-bg/50 hover:bg-bg/80 border border-line/40"
                  )}
                >
                  {item.label}
                </a>
              );
            })}

            {!isHome && pathname.startsWith("/registration") && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="mt-4 text-sm font-pixel py-3 px-6 rounded-xl bg-red text-white border border-transparent shadow-md hover:bg-red/90 transition-colors w-full text-left"
              >
                LOGOUT
              </button>
            )}
          </nav>

          <div className="mt-auto pb-6 text-left shrink-0">
            <div className="h-px w-12 bg-line mr-auto mb-6 opacity-50" />
            <p className="text-muted text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              Nile University<br />Coding Arena
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
