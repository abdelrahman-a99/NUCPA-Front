import React from "react";
import ScoreboardTable, { TeamScore } from "@/components/scoreboard/ScoreboardTable";
import scoreboardData from "@/lib/data/scoreboard.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scoreboard | NUCPA 2026",
  description: "Final Onsite Standings for NUCPA 2026. Egypt's largest competitive programming arena.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ScoreboardPage = () => {
  const data = scoreboardData as TeamScore[];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 md:px-8 bg-white">
        <div className="container-max">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-pixel text-ink mb-4 pixel-outline">
              NUCPA 2026
            </h1>
            <h2 className="text-xl md:text-2xl text-teal font-bold uppercase tracking-[0.2em]">
              Final Onsite Standings
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#1daa1d] rounded-sm" />
                <span>Solved First</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#60e760] rounded-sm" />
                <span>Solved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#e87272] rounded-sm" />
                <span>Tried, Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#6666ff] rounded-sm" />
                <span>Pending / Frozen</span>
              </div>
            </div>
          </header>

          <section className="relative">
            <ScoreboardTable data={data} />
            
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScoreboardPage;
