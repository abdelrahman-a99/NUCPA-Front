"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { TeamDetails, COUNTRIES } from "@/lib/registration-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PixelButton from "@/components/ui/PixelButton";
import InfoRow from "@/components/registration/InfoRow";
import HandleBadge from "@/components/registration/HandleBadge";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function AdminTeamDetailPage() {
    const { id } = useParams();
    const { isAdmin, isLoading, updateTeamStatus, checkAdminStatus } = useAdmin();
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/admin-portal/login");
        } else if (isAdmin === true) {
            fetchTeamDetails();
        }
    }, [isAdmin, router]);

    const fetchTeamDetails = async () => {
        try {
            const res = await fetch(`/api/registration/teams/${id}/details/`, {
                headers: { "X-Admin-Access": "true" }
            });
            if (!res.ok) throw new Error("Failed to fetch team details");
            const data = await res.json();
            setTeam(data);
        } catch (e: any) {
            setError(e.message);
        }
    };


    if (isAdmin === null || !team) {
        return (
            <div className="min-h-screen flex flex-col bg-bg">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="font-pixel text-teal animate-pulse">ACCESSING ENCRYPTED DATA...</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-bg">
            <Navbar />
            <main className="flex-grow py-12 px-4 sm:px-8 bg-dots-about">
                <div className="container-max">
                    <div className="mb-8">
                        <Link href="/admin-portal/dashboard">
                            <button className="text-xs font-bold text-muted hover:text-teal transition-all flex items-center gap-2 mb-4 group">
                                <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO CONSOLE
                            </button>
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="font-pixel text-3xl sm:text-4xl text-ink2 mb-2 uppercase">{team.team_name}</h1>
                                <p className="text-muted text-[10px] font-bold tracking-widest uppercase">Team UID: {id}</p>
                            </div>

                            {/* STATUS CONTROL PANEL */}
                            <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border-2 border-line/30 shadow-sm min-w-[300px]">
                                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Status Workflow</h3>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-ink2 uppercase">Application</label>
                                        <select
                                            className="px-2 py-1 bg-bg border-2 border-line rounded-lg text-xs font-bold focus:outline-none focus:border-teal"
                                            value={team.application_status || "PENDING"}
                                            onChange={(e) => {
                                                const val = e.target.value as any;
                                                // Reset rejection note if not rejected
                                                if (val !== 'REJECTED') {
                                                    setTeam({ ...team, application_status: val, rejection_note: "" });
                                                } else {
                                                    setTeam({ ...team, application_status: val });
                                                }
                                            }}
                                        >
                                            <option value="PENDING">Pending Review</option>
                                            <option value="APPROVED">Approved (Eligible)</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>

                                    {team.application_status === 'REJECTED' && (
                                        <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-[10px] font-bold text-red-500 uppercase">Rejection Note</label>
                                            <textarea
                                                className="px-2 py-1 bg-red-50 border-2 border-red-100 rounded-lg text-xs font-bold text-red-700 focus:outline-none focus:border-red-300 resize-none h-20"
                                                placeholder="Explain why..."
                                                value={team.rejection_note || ""}
                                                onChange={(e) => setTeam({ ...team, rejection_note: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-ink2 uppercase">Online Stage</label>
                                        <select
                                            className="px-2 py-1 bg-bg border-2 border-line rounded-lg text-xs font-bold focus:outline-none focus:border-teal"
                                            value={team.online_status || "NOT_ELIGIBLE"}
                                            onChange={(e) => {
                                                const val = e.target.value as any;
                                                setTeam({ ...team, online_status: val });
                                            }}
                                        >
                                            <option value="NOT_ELIGIBLE">Not Eligible</option>
                                            <option value="ELIGIBLE">Eligible</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-ink2 uppercase">Onsite Stage</label>
                                        <select
                                            className="px-2 py-1 bg-bg border-2 border-line rounded-lg text-xs font-bold focus:outline-none focus:border-teal"
                                            value={team.onsite_status || "NOT_QUALIFIED"}
                                            onChange={(e) => {
                                                const val = e.target.value as any;
                                                setTeam({ ...team, onsite_status: val });
                                            }}
                                        >
                                            <option value="NOT_QUALIFIED">Not Qualified</option>
                                            <option value="QUALIFIED_PENDING">Qualified (Pending Payment)</option>
                                            <option value="QUALIFIED_PAID">Qualified (Paid)</option>
                                        </select>
                                    </div>

                                    <PixelButton
                                        onClick={async () => {
                                            const success = await updateTeamStatus(Number(id), {
                                                application_status: team.application_status,
                                                online_status: team.online_status,
                                                onsite_status: team.onsite_status,
                                                rejection_note: team.rejection_note
                                            });
                                            if (success) alert("Status updated successfully!");
                                        }}
                                        variant="primary"
                                        size="sm"
                                        className="mt-2 w-full justify-center"
                                    >
                                        SAVE CHANGES
                                    </PixelButton>


                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {team.members.map((m, idx) => (
                            <div key={m.id} className="bg-white border-2 border-line rounded-[2rem] p-8 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-6 right-8 font-pixel text-5xl text-teal/5 group-hover:text-teal/10 transition-colors pointer-events-none">
                                    0{idx + 1}
                                </div>

                                <h3 className="font-pixel text-2xl text-ink mb-6 uppercase border-b border-line/30 pb-4">
                                    {m.name}
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoRow label="Email" value={m.email} />
                                        <InfoRow label="Phone" value={m.phone_number} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoRow label="Nationality" value={COUNTRIES.find(c => c.value === m.nationality)?.label || m.nationality} />
                                        <InfoRow label="Birth Year" value={String(m.year)} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoRow label="University" value={m.university === "OTHER" ? (m.university_other || "Other") : m.university} />
                                        <InfoRow label="Year of Study" value={m.year_of_study || "N/A"} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoRow label="National ID / Passport" value={m.national_id} />
                                        {m.nu_student && <InfoRow label="NU ID" value={m.nu_id || "N/A"} />}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-line/30">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">CF Handle</span>
                                            <HandleBadge info={(m as any).codeforces_info} type="cf" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">VJ Handle</span>
                                            <HandleBadge info={(m as any).vjudge_info} type="vj" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-line/30">
                                        <a
                                            href={m.id_document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 py-3 bg-bg hover:bg-teal/10 border-2 border-line hover:border-teal/30 rounded-xl text-xs font-bold text-ink transition-all uppercase"
                                        >
                                            📄 National ID/Passport ↗
                                        </a>
                                        {m.nu_student && m.nu_id_document && (
                                            <a
                                                href={m.nu_id_document}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 py-3 bg-bg hover:bg-teal/10 border-2 border-line hover:border-teal/30 rounded-xl text-xs font-bold text-ink transition-all uppercase"
                                            >
                                                🎓 NU Student ID ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
