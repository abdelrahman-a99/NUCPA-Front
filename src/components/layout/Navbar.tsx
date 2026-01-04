"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/site";
import { cn } from "@/lib/cn";

export default function Navbar() {
  const [active, setActive] = useState<string>("#home");
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
          <a
            href="#contact"
            className="text-[11px] px-3 py-2 rounded-full bg-white border border-line"
          >
            MENU
          </a>
        </div>
      </div>
    </header>
  );
}
