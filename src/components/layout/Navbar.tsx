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
                    : "bg-transparent text-ink border-transparent hover:bg-white hover:border-line"
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
            className="text-[11px] px-4 py-2 rounded-full bg-white border border-line font-bold uppercase tracking-wider"
          >
            MENU
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-10 shrink-0">
            <Image
              src="/assets/logo.png"
              alt="NUCPA"
              width={100}
              height={50}
              className="h-10 w-auto"
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-line/20 text-ink"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => {
              const href = isHome ? item.href : `/${item.href}`;
              const isActive = isHome && item.href === active;
              return (
                <a
                  key={item.href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-xl font-pixel py-4 px-6 rounded-2xl transition-all text-center",
                    isActive
                      ? "bg-teal text-white shadow-lg"
                      : "text-ink bg-bg/50 border border-transparent"
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
                className="mt-2 text-xl font-pixel py-4 px-6 rounded-2xl bg-red text-white border border-transparent text-center shadow-lg"
              >
                LOGOUT
              </button>
            )}
          </nav>

          <div className="mt-12 mb-8 text-center shrink-0">
            <p className="text-muted text-[10px] font-pixel uppercase tracking-widest">Nile University Coding Arena</p>
          </div>
        </div>
      )}
    </header>
  );
}
