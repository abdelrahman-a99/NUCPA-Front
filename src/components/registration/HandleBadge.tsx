import React from "react";
import { cn } from "@/lib/cn";

interface HandleInfo {
    handle: string;
    rank?: string;
    rating?: number;
    profile_url: string;
}

const RANK_COLORS: Record<string, string> = {
    newbie: "text-[#808080]",
    pupil: "text-[#008000]",
    specialist: "text-[#03a89e]",
    expert: "text-[#0000ff]",
    "candidate master": "text-[#a0a]",
    master: "text-[#ff8c00]",
    "international master": "text-[#ff8c00]",
    grandmaster: "text-[#f00]",
    "international grandmaster": "text-[#f00]",
    "legendary grandmaster": "text-[#f00]",
};

export default function HandleBadge({
    info,
    type = "cf"
}: {
    info: HandleInfo | null | undefined;
    type?: "cf" | "vj"
}) {
    if (!info) return <span className="text-muted italic text-[10px]">N/A</span>;

    const { handle, rank, profile_url } = info;
    const colorClass = type === "cf" && rank ? (RANK_COLORS[rank.toLowerCase()] || "text-ink") : "text-ink";

    const isLGM = type === "cf" && rank?.toLowerCase() === "legendary grandmaster";

    return (
        <a
            href={profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 group",
                colorClass
            )}
            title={type === "cf" ? `Codeforces: ${rank || "Unrated"}` : `Vjudge Profile`}
        >
            <span className="font-bold flex items-center">
                {isLGM ? (
                    <>
                        <span className="text-black">{handle[0]}</span>
                        {handle.slice(1)}
                    </>
                ) : (
                    handle
                )}
            </span>
            <svg
                className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
        </a>
    );
}
