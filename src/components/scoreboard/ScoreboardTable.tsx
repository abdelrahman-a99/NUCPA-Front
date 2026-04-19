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
    <div className="w-full overflow-x-auto rounded-4xl border border-line bg-white shadow-xl mt-8">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-ink2 text-white font-pixel uppercase tracking-wider">
            <th className="px-2 py-4 text-center sticky left-0 z-20 bg-ink2 text-xs md:text-sm w-[48px] min-w-[48px] max-w-[48px] md:w-[56px] md:min-w-[56px] md:max-w-[56px] shadow-[inset_-2px_0_0_0_#ffffff]">
              Rank
            </th>
            <th className="px-3 md:px-4 py-4 sticky left-[48px] md:left-[56px] z-20 bg-ink2 text-xs md:text-sm text-left w-[110px] min-w-[110px] max-w-[110px] md:w-[160px] md:min-w-[160px] md:max-w-[160px] shadow-[inset_-2px_0_0_0_#ffffff] md:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.1)] border-none">
              Team
            </th>
            <th className="px-2 md:px-4 py-4 text-center z-10 md:z-20 bg-ink2 text-xs md:text-sm relative md:sticky md:left-[216px] w-[70px] min-w-[70px] max-w-[70px] md:w-[80px] md:min-w-[80px] md:max-w-[80px] shadow-none md:shadow-[inset_-2px_0_0_0_#ffffff]">
              Score
            </th>
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
                  "transition-colors hover:bg-green-200",
                  rowBg
                )}
              >
                <td className={cn(
                  "px-2 py-3 text-center font-bold sticky left-0 z-10 bg-clip-padding text-xs md:text-sm w-[48px] min-w-[48px] max-w-[48px] md:w-[56px] md:min-w-[56px] md:max-w-[56px] shadow-[inset_-2px_0_0_0_#ffffff]",
                  isEven ? "bg-white" : "bg-[#fcfcfc]"
                )}>
                  {row.rank}
                </td>
                <td className={cn(
                  "px-3 md:px-4 py-3 font-medium sticky left-[48px] md:left-[56px] z-10 bg-clip-padding text-xs md:text-sm w-[110px] min-w-[110px] max-w-[110px] md:w-[160px] md:min-w-[160px] md:max-w-[160px] shadow-[inset_-2px_0_0_0_#e5e7eb] md:shadow-[inset_-1px_0_0_0_#e5e7eb]",
                  isEven ? "bg-white" : "bg-[#fcfcfc]",
                  "whitespace-normal break-words leading-tight" /* This forces the text to wrap to the next line */
                )}>
                  {row.team}
                </td>
                <td className={cn(
                  "px-2 md:px-4 py-3 text-center relative md:sticky md:left-[216px] z-0 md:z-10 bg-clip-padding w-[70px] min-w-[70px] max-w-[70px] md:w-[80px] md:min-w-[80px] md:max-w-[80px] shadow-none md:shadow-[inset_-2px_0_0_0_#e5e7eb]",
                  isEven ? "bg-white" : "bg-[#fcfcfc]"
                )}>
                  <div className="flex flex-col">
                    <span className="font-bold text-teal text-xs md:text-sm">{row.solved}</span>
                    <span className="text-[9px] md:text-[10px] text-muted font-mono">{row.penalty}</span>
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
                              {prob.tries} {prob.tries === 1 ? "attempt" : "attempts"}
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
