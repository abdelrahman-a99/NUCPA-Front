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

    // Filter State
    const [appStatus, setAppStatus] = useState("");
    const [onlineStatus, setOnlineStatus] = useState("");
    const [onsiteStatus, setOnsiteStatus] = useState("");

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

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        fetchTeams(search, {
            application_status: appStatus || undefined,
            online_status: onlineStatus || undefined,
            onsite_status: onsiteStatus || undefined
        });
    };

    // Trigger search when filters change
    useEffect(() => {
        if (isAdmin) {
            fetchTeams(search, {
                application_status: appStatus || undefined,
                online_status: onlineStatus || undefined,
                onsite_status: onsiteStatus || undefined
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStatus, onlineStatus, onsiteStatus]);

    // Calculate Stats
    const totalTeams = teams.length;
    const paidTeams = teams.filter(t => t.onsite_status === 'QUALIFIED_PAID').length;
    const readyTeams = teams.filter(t => t.online_status === 'ELIGIBLE').length;

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

                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="font-pixel text-xl text-ink2">TEAM LIST</h3>
                            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search teams or members..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="px-6 py-3 rounded-xl bg-white border-2 border-line focus:border-teal focus:ring-4 focus:ring-teal/10 outline-none transition-all w-full md:w-80 font-bold text-sm text-ink placeholder:text-muted/50 shadow-sm"
                                />
                                <PixelButton type="submit" variant="primary" size="sm" className="shrink-0">
                                    SEARCH
                                </PixelButton>
                            </form>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap gap-4 p-4 bg-white/50 border border-line rounded-xl items-center">
                            <span className="text-xs font-bold uppercase text-muted tracking-widest">FILTERS:</span>

                            <select
                                value={appStatus}
                                onChange={(e) => setAppStatus(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-line bg-white text-sm font-bold text-ink2 outline-none focus:border-teal cursor-pointer"
                            >
                                <option value="">ALL STATUSES</option>
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>

                            <select
                                value={onlineStatus}
                                onChange={(e) => setOnlineStatus(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-line bg-white text-sm font-bold text-ink2 outline-none focus:border-teal cursor-pointer"
                            >
                                <option value="">ALL ONLINE ELIGIBILITY</option>
                                <option value="ELIGIBLE">ELIGIBLE</option>
                                <option value="NOT_ELIGIBLE">NOT ELIGIBLE</option>
                            </select>

                            <select
                                value={onsiteStatus}
                                onChange={(e) => setOnsiteStatus(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-line bg-white text-sm font-bold text-ink2 outline-none focus:border-teal cursor-pointer"
                            >
                                <option value="">ALL ONSITE STATUS</option>
                                <option value="NOT_QUALIFIED">NOT QUALIFIED</option>
                                <option value="QUALIFIED_PENDING">QUALIFIED (PENDING)</option>
                                <option value="QUALIFIED_PAID">QUALIFIED (PAID)</option>
                            </select>

                            {(appStatus || onlineStatus || onsiteStatus) && (
                                <button
                                    onClick={() => { setAppStatus(""); setOnlineStatus(""); setOnsiteStatus(""); }}
                                    className="text-xs text-red-500 font-bold hover:underline ml-auto"
                                >
                                    CLEAR FILTERS
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border-2 border-line rounded-[2rem] shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg/50 border-b-2 border-line">
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">Team</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">Members</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">App</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Online</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Onsite</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line/50">
                                    {teams.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center text-muted font-pixel text-sm">
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
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                        team.application_status === 'APPROVED' ? "bg-teal/10 text-teal border-teal/20" :
                                                            team.application_status === 'REJECTED' ? "bg-red/10 text-red border-red/20" :
                                                                "bg-yellow-50 text-yellow-600 border-yellow-200"
                                                    )}>
                                                        {team.application_status || "PENDING"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                        team.online_status === 'ELIGIBLE' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-gray-100 text-gray-400 border-gray-200"
                                                    )}>
                                                        {team.online_status === 'ELIGIBLE' ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                        team.onsite_status === 'QUALIFIED_PAID' ? "bg-green-50 text-green-600 border-green-200" :
                                                            team.onsite_status === 'QUALIFIED_PENDING' ? "bg-orange-50 text-orange-600 border-orange-200" :
                                                                "bg-gray-100 text-gray-400 border-gray-200"
                                                    )}>
                                                        {team.onsite_status === 'QUALIFIED_PAID' ? 'PAID' :
                                                            team.onsite_status === 'QUALIFIED_PENDING' ? 'PENDING' : 'NOT QUALIFIED'}
                                                    </span>
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
