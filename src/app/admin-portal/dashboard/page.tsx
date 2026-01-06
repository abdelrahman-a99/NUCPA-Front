"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PixelButton from "@/components/ui/PixelButton";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function AdminDashboardPage() {
    const { isAdmin, isLoading, teams, fetchTeams, updateTeamStatus, deleteTeam, checkAdminStatus } = useAdmin();
    const [search, setSearch] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/admin-portal/login");
        } else if (isAdmin === true) {
            fetchTeams();
        }
    }, [isAdmin, router, fetchTeams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTeams(search);
    };

    // Calculate Stats
    const totalTeams = teams.length;
    const paidTeams = teams.filter(t => t.payment_status).length;
    const readyTeams = teams.filter(t => t.checked_in).length;

    // Export to CSV from Backend
    const handleExportCSV = async () => {
        try {
            setIsExporting(true);
            const res = await fetch("/api/registration/export-csv/");

            if (!res.ok) {
                if (res.status === 403) alert("Permission Denied: Admins only.");
                else alert("Failed to download CSV.");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nucpa_teams_export_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("An error occurred while exporting.");
        } finally {
            setIsExporting(false);
        }
    };

    if (isAdmin === null || (isLoading && teams.length === 0)) {
        return (
            <div className="min-h-screen flex flex-col bg-bg">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="font-pixel text-teal animate-pulse">BOOTING SYSTEM...</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-bg">
            <Navbar />
            <main className="flex-grow py-12 px-4 sm:px-8">
                <div className="container-max">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="font-pixel text-3xl sm:text-5xl text-ink2 mb-2">ADMIN CONSOLE</h1>
                            <p className="text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-bright animate-ping"></span>
                                Real-time Registration Data
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <PixelButton onClick={handleExportCSV} variant="ghost" size="sm" className="hidden md:flex" disabled={isExporting}>
                                {isExporting ? "⏳ DOWNLOADING..." : "⬇ EXPORT CSV"}
                            </PixelButton>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white border-2 border-line rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-teal/30 transition-colors">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Total Teams</p>
                                <p className="font-pixel text-4xl text-ink">{totalTeams}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center font-pixel text-xl text-muted group-hover:text-teal group-hover:bg-teal/10 transition-colors">
                                👥
                            </div>
                        </div>
                        <div className="bg-white border-2 border-line rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-teal/30 transition-colors">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Paid & Verified</p>
                                <p className="font-pixel text-4xl text-teal">{paidTeams}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center font-pixel text-xl text-teal">
                                💰
                            </div>
                        </div>
                        <div className="bg-white border-2 border-line rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-teal/30 transition-colors">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Ready to Compete</p>
                                <p className="font-pixel text-4xl text-purple-600">{readyTeams}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-pixel text-xl text-purple-600">
                                🚀
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h3 className="font-pixel text-xl text-ink2">TEAM LIST</h3>
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search teams or members..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-6 py-3 rounded-full bg-white border border-line focus:border-teal outline-none transition-all w-full md:w-80 font-medium text-sm shadow-sm"
                            />
                            <PixelButton type="submit" variant="primary" size="sm" className="shrink-0">
                                SEARCH
                            </PixelButton>
                        </form>
                    </div>

                    <div className="bg-white border-2 border-line rounded-[2rem] shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg/50 border-b-2 border-line">
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">Team</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">Members</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Payment</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Eligible</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line/50">
                                    {teams.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-muted font-pixel text-sm">
                                                NO TEAMS FOUND IN THE ARENA
                                            </td>
                                        </tr>
                                    ) : (
                                        teams.map((team) => (
                                            <tr key={team.id} className="hover:bg-bg/30 transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="font-pixel text-lg text-ink group-hover:text-teal transition-colors">
                                                        {team.team_name}
                                                    </div>
                                                    <div className="text-[10px] text-muted font-bold mt-1">ID: #{team.id}</div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-bold text-ink2 truncate max-w-[200px]">Member Count: {team.member_count || 0}</span>
                                                        <span className="text-xs text-muted italic">View details to manage members</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <button
                                                        onClick={() => updateTeamStatus(team.id, "payment_status", !team.payment_status)}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-2 transition-all active:scale-90",
                                                            team.payment_status
                                                                ? "bg-teal/10 text-teal border-teal/20"
                                                                : "bg-red/5 text-red border-red/10"
                                                        )}
                                                    >
                                                        {team.payment_status ? "PAID" : "PENDING"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <button
                                                        onClick={() => updateTeamStatus(team.id, "checked_in", !team.checked_in)}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-2 transition-all active:scale-90",
                                                            team.checked_in
                                                                ? "bg-teal-bright text-white border-transparent shadow-soft"
                                                                : "bg-bg text-muted border-line"
                                                        )}
                                                    >
                                                        {team.checked_in ? "READY" : "WAITING"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin-portal/dashboard/${team.id}`}>
                                                            <PixelButton variant="primary" size="xs">VIEW</PixelButton>
                                                        </Link>
                                                        <PixelButton
                                                            variant="outline-red"
                                                            size="xs"
                                                            onClick={() => deleteTeam(team.id)}
                                                        >
                                                            DEL
                                                        </PixelButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
