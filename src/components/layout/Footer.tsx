"use client";

import { NAV_ITEMS } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="bg-ink2 text-white">
      <div className="container-max py-10">
        <div className="flex flex-col items-center gap-3 lg:gap-2">
          <Link href="/">
            <Image
              src="/assets/logo_2.png"
              alt="NUCPA"
              width={100}
              height={48}
              className="h-12 w-auto drop-shadow"
            />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-20 text-[12px] lg:text-[16px] font-semibold opacity-80">
            {NAV_ITEMS.map((item) => {
              const href = isHome ? item.href : `/${item.href}`;
              return (
                <Link key={item.href} href={href} className="hover:opacity-100">
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-8 opacity-80">
            <a href="https://www.facebook.com/profile.php?id=61585629425649" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-100">
              <img src="/assets/icon-facebook.svg" alt="" className="h-6 lg:h-8 w-6 lg:w-8" />
            </a>
            <a href="https://www.linkedin.com/company/nu-icpc/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-100">
              <img src="/assets/icon-linkedin.svg" alt="" className="h-6 lg:h-8 w-6 lg:w-8" />
            </a>
            <a href="https://www.instagram.com/nucpacompetition/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-100">
              <img src="/assets/icon-instagram.svg" alt="" className="h-6 lg:h-8 w-6 lg:w-8" />
            </a>
          </div>

          <p className="text-xs lg:text-s opacity-70">© {new Date().getFullYear()} NUCPA</p>
        </div>
      </div>
    </footer>
  );
}
