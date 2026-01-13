"use client";

import Image from "next/image";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PixelButton from "@/components/ui/PixelButton";
import { EVENT_DATE_ISO } from "@/lib/site";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [diffMs, setDiffMs] = useState(0);

  useEffect(() => {
    const tick = () => setDiffMs(Math.max(0, target - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE_ISO);
  const router = useRouter();

  const handleLoginSuccess = useMemo(() => {
    return () => router.push("/registration");
  }, [router]);

  const { login, isLoading } = useGoogleLogin({
    onSuccess: handleLoginSuccess,
  });

  return (
    <section id="home">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center text-center lg:text-left mt-4 lg:mt-0">
          <div>
            <h1 className="font-pixel text-4xl lg:text-7xl text-teal-bright pixel-outline">
              JOIN THE
            </h1>
            <h1 className="font-pixel text-4xl lg:text-7xl pt-4 lg:pt-6 text-teal-bright pixel-outline">
              COMPETITIVE PROGRAMMING ARENA
            </h1>

            <p className="mt-4 text-base lg:text-lg font-semibold tracking-widest max-w-md mx-auto lg:mx-0">
              Egypt&apos;s largest student-led
              <br />
              problem-solving competition
            </p>

            <div className="mt-4 lg:mt-6 flex flex-nowrap lg:flex-wrap justify-center lg:justify-start gap-4">
              <PixelButton onClick={() => login()} variant="primary">
                {isLoading ? "OPENING..." : "REGISTER NOW"}
              </PixelButton>
              <PixelButton href="/#about" variant="outline-red">
                LEARN MORE
              </PixelButton>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <Image
              src="/assets/Dots_Octopus.png"
              alt="Hero character - Octopus with laptop"
              width={480}
              height={480}
              className="w-[240px] sm:w-[380px] lg:w-[480px] h-auto select-none"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm sm:text-xl font-semibold">
            Get ready for the NUCPA 2026 First Stage Online — happening on{" "}
            <span className="font-bold">FEBRUARY 14TH</span>
            , at 8:35 PM!
          </p>

          <div className="mt-4 flex items-center justify-center gap-8 sm:gap-24">
            <TimeBox value={days} label="days" />
            <TimeBox value={hours} label="hours" />
            <TimeBox value={minutes} label="min" />
            <TimeBox value={seconds} label="sec" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  const display = label === "hours" || label === "min" || label === "sec" ? pad2(value) : String(value);
  return (
    <div className="text-center">
      <div className="font-pixel text-3xl sm:text-7xl text-ink2 tracking-wider">
        {display}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-muted">{label}</div>
    </div>
  );
}
