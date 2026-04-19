"use client";

import React from "react";
import { cn } from "@/lib/cn";

export type ProblemStatus = "solved" | "first" | "incorrect" | "untried";

export interface ProblemResult {
  label: string;
  time?: number;
  tries: number;
  status: ProblemStatus;
  afterFreeze?: boolean;
}

export interface TeamScore {
  rank: number;
  team: string;
  solved: number;
  penalty: number;
  problems: ProblemResult[];
}

interface ScoreboardTableProps {
  data: TeamScore[];
}

const ScoreboardTable = ({ data }: ScoreboardTableProps) => {
  const problems = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-line bg-white shadow-xl mt-8">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-ink2 text-white font-pixel uppercase tracking-wider">
            <th className="px-2 py-4 text-center sticky left-0 z-20 bg-ink2 border-r border-white/10 min-w-[56px] max-w-[56px]">Rank</th>
            <th className="px-6 py-4 sticky left-[56px] z-20 bg-ink2 border-r border-white/10 min-w-[180px] text-left">Team</th>
            <th className="px-4 py-4 text-center border-r border-white/10 min-w-[80px]">Score</th>
            {problems.map((p) => (
              <th key={p} className="px-2 py-4 text-center min-w-[55px] border-r border-white/10 last:border-r-0">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {data.map((row, idx) => {
            const isEven = idx % 2 === 0;
            const rowBg = isEven ? "bg-white" : "bg-gray-50/50";
            
            return (
              <tr 
                key={`${row.team}-${idx}`}
                className={cn(
                  "transition-colors hover:bg-teal/5",
                  rowBg
                )}
              >
                <td className={cn(
                  "px-2 py-3 text-center font-bold sticky left-0 z-10 border-r border-line min-w-[56px] max-w-[56px]",
                  isEven ? "bg-white" : "bg-[#fcfcfc]"
                )}>
                  {row.rank}
                </td>
                <td className={cn(
                  "px-6 py-3 font-medium sticky left-[56px] z-10 border-r border-line truncate max-w-[220px]",
                  isEven ? "bg-white" : "bg-[#fcfcfc]"
                )}>
                  {row.team}
                </td>
                <td className="px-4 py-3 text-center border-r border-line">
                  <div className="flex flex-col">
                    <span className="font-bold text-teal">{row.solved}</span>
                    <span className="text-[10px] text-muted font-mono">{row.penalty}</span>
                  </div>
                </td>
                {problems.map((pLabel) => {
                  const prob = row.problems.find((pr) => pr.label === pLabel) || {
                    label: pLabel,
                    tries: 0,
                    status: "untried" as ProblemStatus,
                  };

                  return (
                    <td
                      key={pLabel}
                      className={cn(
                        "px-1 py-1 text-center border-r border-line last:border-r-0 relative group",
                        prob.status === "first" && "bg-[#1daa1d] text-white",
                        prob.status === "solved" && "bg-[#60e760] text-ink",
                        prob.status === "incorrect" && "bg-[#e87272] text-white"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center min-h-[40px]">
                        {prob.status !== "untried" && (
                          <>
                            <span className="font-bold text-xs">
                              {prob.time !== undefined && prob.time !== null ? prob.time : ""}
                            </span>
                            <span className={cn(
                              "text-[10px] opacity-80",
                              prob.status === "solved" ? "text-ink/60" : "text-white/80"
                            )}>
                              {prob.tries} {prob.tries === 1 ? "try" : "tries"}
                            </span>
                          </>
                        )}
                      </div>
                      {prob.afterFreeze && (
                        <div 
                          className="absolute top-0 right-0 w-3 h-3 bg-[#3333ff]" 
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreboardTable;
