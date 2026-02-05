"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PixelButton from "@/components/ui/PixelButton";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { UNIVERSITY_CHOICES } from "@/lib/registration-data";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// Chart colors
const CHART_COLORS = [
    "#14b8a6", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6",
    "#10b981", "#f97316", "#6366f1", "#84cc16", "#06b6d4"
];

// Country code to flag emoji helper
const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return "🌍";
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// Format date for display
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function AdminDashboardPage() {
    const { isAdmin, isLoading, teams, fetchTeams, updateTeamStatus, deleteTeam, checkAdminStatus } = useAdmin();
    const [search, setSearch] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    // Filter State
    const [appStatus, setAppStatus] = useState("");
    const [onlineStatus, setOnlineStatus] = useState("");
    const [onsiteStatus, setOnsiteStatus] = useState("");

    // Advanced Filters
    const [ordering, setOrdering] = useState("-created_at");
    const [university, setUniversity] = useState("");
    const [hasForeigners, setHasForeigners] = useState(false);
    const [isNUTeam, setIsNUTeam] = useState(false);

    // Batch Selection State
    const [selectedTeams, setSelectedTeams] = useState<Set<number>>(new Set());
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [batchRejectNote, setBatchRejectNote] = useState("");

    const router = useRouter();

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/nucpa-secret-admin/login");
        } else if (isAdmin === true) {
            fetchTeams();
        }
    }, [isAdmin, router, fetchTeams]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        fetchTeams(search, {
            application_status: appStatus || undefined,
            online_status: onlineStatus || undefined,
            onsite_status: onsiteStatus || undefined,
            university: university || undefined,
            has_foreigners: hasForeigners || undefined,
            is_nu_team: isNUTeam || undefined,
            ordering
        });
    };

    // Trigger search when filters change
    useEffect(() => {
        if (isAdmin) {
            fetchTeams(search, {
                application_status: appStatus || undefined,
                online_status: onlineStatus || undefined,
                onsite_status: onsiteStatus || undefined,
                university: university || undefined,
                has_foreigners: hasForeigners || undefined,
                is_nu_team: isNUTeam || undefined,
                ordering
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStatus, onlineStatus, onsiteStatus, university, hasForeigners, isNUTeam, ordering]);

    // Enhanced Stats with useMemo for performance
    const stats = useMemo(() => {
        const totalTeams = teams.length;
        const pendingTeams = teams.filter(t => t.application_status === 'PENDING').length;
        const approvedTeams = teams.filter(t => t.application_status === 'APPROVED').length;
        const paidTeams = teams.filter(t => t.onsite_status === 'QUALIFIED_PAID').length;
        const readyTeams = teams.filter(t => t.online_status === 'ELIGIBLE').length;
        const foreignTeams = teams.filter(t => (t as any).has_foreigners === true).length;
        const incompleteDocsTeams = teams.filter(t => (t as any).documents_complete === false).length;

        // Count unique universities that actually have teams
        const allUniversities = new Set<string>();
        teams.forEach(t => {
            const unis = (t as any).universities;
            if (Array.isArray(unis)) {
                unis.forEach((u: string) => allUniversities.add(u));
            }
        });
        const universitiesCount = allUniversities.size;

        return { totalTeams, pendingTeams, approvedTeams, paidTeams, readyTeams, foreignTeams, incompleteDocsTeams, universitiesCount };
    }, [teams]);

    // Chart data: University distribution (top 10)
    const universityChartData = useMemo(() => {
        const uniCount: Record<string, number> = {};
        teams.forEach(t => {
            const unis = (t as any).universities;
            if (Array.isArray(unis)) {
                unis.forEach((u: string) => {
                    uniCount[u] = (uniCount[u] || 0) + 1;
                });
            }
        });
        return Object.entries(uniCount)
            .map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 20) + "..." : name, value, fullName: name }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [teams]);

    // Chart data: Registration timeline (last 14 days)
    const registrationChartData = useMemo(() => {
        const now = new Date();
        const days: { date: string; count: number }[] = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            days.push({ date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), count: 0 });
        }
        teams.forEach(t => {
            const regDate = new Date(t.created_at).toISOString().slice(0, 10);
            const idx = days.findIndex((d, i) => {
                const checkDate = new Date();
                checkDate.setDate(checkDate.getDate() - (13 - i));
                return checkDate.toISOString().slice(0, 10) === regDate;
            });
            if (idx >= 0) days[idx].count++;
        });
        return days;
    }, [teams]);

    // Chart data: Status funnel
    const statusFunnelData = useMemo(() => [
        { name: "Pending", value: stats.pendingTeams, color: "#f59e0b" },
        { name: "Approved", value: stats.approvedTeams, color: "#14b8a6" },
        { name: "Eligible", value: stats.readyTeams, color: "#8b5cf6" },
        { name: "Paid", value: stats.paidTeams, color: "#10b981" },
    ], [stats]);

    // Batch selection handlers
    const toggleTeamSelection = (teamId: number) => {
        setSelectedTeams(prev => {
            const newSet = new Set(prev);
            if (newSet.has(teamId)) {
                newSet.delete(teamId);
            } else {
                newSet.add(teamId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedTeams.size === teams.length) {
            setSelectedTeams(new Set());
        } else {
            setSelectedTeams(new Set(teams.map(t => t.id)));
        }
    };

    const handleBatchApprove = async () => {
        if (selectedTeams.size === 0) return;
        if (!confirm(`Are you sure you want to APPROVE ${selectedTeams.size} teams?`)) return;

        setIsBatchProcessing(true);
        try {
            for (const teamId of selectedTeams) {
                await updateTeamStatus(teamId, { application_status: 'APPROVED' });
            }
            setSelectedTeams(new Set());
            fetchTeams();
        } catch (e) {
            alert("Some teams failed to update.");
        } finally {
            setIsBatchProcessing(false);
        }
    };

    const handleBatchReject = async () => {
        if (selectedTeams.size === 0 || !batchRejectNote.trim()) return;

        setIsBatchProcessing(true);
        try {
            for (const teamId of selectedTeams) {
                await updateTeamStatus(teamId, {
                    application_status: 'REJECTED',
                    rejection_note: batchRejectNote.trim()
                });
            }
            setSelectedTeams(new Set());
            setShowRejectModal(false);
            setBatchRejectNote("");
            fetchTeams();
        } catch (e) {
            alert("Some teams failed to update.");
        } finally {
            setIsBatchProcessing(false);
        }
    };

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

                    {/* Enhanced Stats Grid - 2 rows */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white border-2 border-line rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-teal/30 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Total Teams</p>
                                <p className="font-pixel text-3xl text-ink">{stats.totalTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-lg">👥</div>
                        </div>
                        <div className="bg-white border-2 border-yellow-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-yellow-400 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Pending Review</p>
                                <p className="font-pixel text-3xl text-yellow-600">{stats.pendingTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-lg">⏳</div>
                        </div>
                        <div className="bg-white border-2 border-teal/20 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-teal/50 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Approved</p>
                                <p className="font-pixel text-3xl text-teal">{stats.approvedTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-lg">✅</div>
                        </div>
                        <div className="bg-white border-2 border-green-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-green-400 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Paid & Ready</p>
                                <p className="font-pixel text-3xl text-green-600">{stats.paidTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-lg">💰</div>
                        </div>
                        <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-purple-400 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Universities</p>
                                <p className="font-pixel text-3xl text-purple-600">{stats.universitiesCount}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-lg">🏫</div>
                        </div>
                        <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-blue-400 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Foreign Teams</p>
                                <p className="font-pixel text-3xl text-blue-600">{stats.foreignTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">🌍</div>
                        </div>
                        <div className="bg-white border-2 border-orange-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-orange-400 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Missing Docs</p>
                                <p className="font-pixel text-3xl text-orange-600">{stats.incompleteDocsTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-lg">📄</div>
                        </div>
                        <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-purple-400 transition-colors">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Online Ready</p>
                                <p className="font-pixel text-3xl text-purple-600">{stats.readyTeams}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-lg">🚀</div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* University Distribution Pie Chart */}
                        <div className="bg-white border-2 border-line rounded-2xl p-6 shadow-sm">
                            <h3 className="font-pixel text-lg text-ink2 mb-4">🏫 Top Universities</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={universityChartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, value }) => `${value}`}
                                        >
                                            {universityChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Registration Timeline Bar Chart */}
                        <div className="bg-white border-2 border-line rounded-2xl p-6 shadow-sm">
                            <h3 className="font-pixel text-lg text-ink2 mb-4">📅 Registrations (14 Days)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={registrationChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Funnel */}
                        <div className="bg-white border-2 border-line rounded-2xl p-6 shadow-sm">
                            <h3 className="font-pixel text-lg text-ink2 mb-4">📊 Status Pipeline</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statusFunnelData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                            {statusFunnelData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
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
                        <div className="flex flex-wrap gap-3 p-4 bg-white/50 border border-line rounded-xl items-center">
                            <span className="text-xs font-bold uppercase text-muted tracking-widest">FILTERS:</span>

                            {/* Sort Order */}
                            <select
                                value={ordering}
                                onChange={(e) => setOrdering(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-line bg-white text-sm font-bold text-ink2 outline-none focus:border-teal cursor-pointer"
                                title="Sort Order"
                            >
                                <option value="-created_at">📅 Newest First</option>
                                <option value="created_at">📅 Oldest First</option>
                                <option value="team_name">🅰️ Name (A-Z)</option>
                                <option value="-team_name">🅰️ Name (Z-A)</option>
                            </select>

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

                            {/* Fixed University Filter */}
                            <select
                                value={university}
                                onChange={(e) => setUniversity(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-line bg-white text-sm font-bold text-ink2 outline-none focus:border-teal cursor-pointer max-w-[200px]"
                            >
                                <option value="">All Universities</option>
                                {UNIVERSITY_CHOICES.map((uni) => (
                                    <option key={uni.value} value={uni.value}>
                                        {uni.label}
                                    </option>
                                ))}
                            </select>

                            {/* Toggles */}
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-line bg-white cursor-pointer select-none hover:border-teal/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={hasForeigners}
                                    onChange={(e) => setHasForeigners(e.target.checked)}
                                    className="w-4 h-4 text-teal rounded border-gray-300 focus:ring-teal"
                                />
                                <span className="text-sm font-bold text-ink2">🌍 Has Foreigners</span>
                            </label>

                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-line bg-white cursor-pointer select-none hover:border-teal/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isNUTeam}
                                    onChange={(e) => setIsNUTeam(e.target.checked)}
                                    className="w-4 h-4 text-teal rounded border-gray-300 focus:ring-teal"
                                />
                                <span className="text-sm font-bold text-ink2">🏫 NU Teams</span>
                            </label>

                            {(appStatus || onlineStatus || onsiteStatus || university || hasForeigners || isNUTeam) && (
                                <button
                                    onClick={() => {
                                        setAppStatus("");
                                        setOnlineStatus("");
                                        setOnsiteStatus("");
                                        setUniversity("");
                                        setHasForeigners(false);
                                        setIsNUTeam(false);
                                        setOrdering("-created_at");
                                    }}
                                    className="text-xs text-red-500 font-bold hover:underline ml-auto"
                                >
                                    CLEAR FILTERS
                                </button>
                            )}
                        </div>

                        {/* Batch Actions Bar */}
                        {selectedTeams.size > 0 && (
                            <div className="flex flex-wrap items-center gap-4 p-4 bg-teal/10 border-2 border-teal/30 rounded-xl">
                                <span className="font-bold text-teal">
                                    {selectedTeams.size} team{selectedTeams.size > 1 ? 's' : ''} selected
                                </span>
                                <div className="flex gap-2 ml-auto">
                                    <PixelButton
                                        onClick={handleBatchApprove}
                                        variant="primary"
                                        size="xs"
                                        disabled={isBatchProcessing}
                                    >
                                        {isBatchProcessing ? "⏳" : "✅"} APPROVE SELECTED
                                    </PixelButton>
                                    <PixelButton
                                        onClick={() => setShowRejectModal(true)}
                                        variant="outline-red"
                                        size="xs"
                                        disabled={isBatchProcessing}
                                    >
                                        ❌ REJECT SELECTED
                                    </PixelButton>
                                    <button
                                        onClick={() => setSelectedTeams(new Set())}
                                        className="text-sm text-muted hover:text-ink font-bold"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border-2 border-line rounded-[2rem] shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg/50 border-b-2 border-line">
                                        <th className="px-4 py-5 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedTeams.size === teams.length && teams.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 text-teal rounded border-gray-300 focus:ring-teal cursor-pointer"
                                                title="Select All"
                                            />
                                        </th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">Team</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">University</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted">Registered</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Docs</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">App</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Online</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-center">Onsite</th>
                                        <th className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-muted text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line/50">
                                    {teams.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-20 text-center text-muted font-pixel text-sm">
                                                NO TEAMS FOUND IN THE ARENA
                                            </td>
                                        </tr>
                                    ) : (
                                        teams.map((team) => {
                                            const teamAny = team as any;
                                            const universities = teamAny.universities || [];
                                            const nationalities = teamAny.nationalities || [];
                                            const docsComplete = teamAny.documents_complete;

                                            return (
                                                <tr key={team.id} className={cn(
                                                    "hover:bg-bg/30 transition-colors group",
                                                    selectedTeams.has(team.id) && "bg-teal/5"
                                                )}>
                                                    <td className="px-4 py-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTeams.has(team.id)}
                                                            onChange={() => toggleTeamSelection(team.id)}
                                                            className="w-4 h-4 text-teal rounded border-gray-300 focus:ring-teal cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-pixel text-base text-ink group-hover:text-teal transition-colors">
                                                            {team.team_name}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-muted font-bold">ID: #{team.id}</span>
                                                            {nationalities.map((nat: string, idx: number) => (
                                                                <span key={idx} title={nat} className="text-sm">
                                                                    {getFlagEmoji(nat)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {/* Show all universities, not just first one */}
                                                        <div className="flex flex-col gap-0.5">
                                                            {universities.length === 0 ? (
                                                                <span className="text-sm text-muted">—</span>
                                                            ) : (
                                                                universities.map((uni: string, idx: number) => (
                                                                    <div key={idx} className="text-sm font-bold text-ink2 truncate max-w-[180px]" title={uni}>
                                                                        {uni}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-sm text-ink2">{formatDate(team.created_at)}</div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={cn(
                                                            "text-lg",
                                                            docsComplete === true ? "text-green-500" : docsComplete === false ? "text-red-500" : "text-gray-300"
                                                        )}>
                                                            {docsComplete === true ? "✅" : docsComplete === false ? "❌" : "—"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                            team.application_status === 'APPROVED' ? "bg-teal/10 text-teal border-teal/20" :
                                                                team.application_status === 'REJECTED' ? "bg-red/10 text-red border-red/20" :
                                                                    "bg-yellow-50 text-yellow-600 border-yellow-200"
                                                        )}>
                                                            {team.application_status || "PENDING"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                            team.online_status === 'ELIGIBLE' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-gray-100 text-gray-400 border-gray-200"
                                                        )}>
                                                            {team.online_status === 'ELIGIBLE' ? 'ELIGIBLE' : 'NOT'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                            team.onsite_status === 'QUALIFIED_PAID' ? "bg-green-50 text-green-600 border-green-200" :
                                                                team.onsite_status === 'QUALIFIED_PENDING' ? "bg-orange-50 text-orange-600 border-orange-200" :
                                                                    "bg-gray-100 text-gray-400 border-gray-200"
                                                        )}>
                                                            {team.onsite_status === 'QUALIFIED_PAID' ? 'PAID' :
                                                                team.onsite_status === 'QUALIFIED_PENDING' ? 'PENDING' : 'NOT'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/nucpa-secret-admin/dashboard/${team.id}`}>
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
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Batch Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="font-pixel text-xl text-ink2 mb-4">Reject {selectedTeams.size} Teams</h3>
                        <p className="text-sm text-muted mb-4">
                            Enter a rejection note that will be sent to all selected teams:
                        </p>
                        <textarea
                            value={batchRejectNote}
                            onChange={(e) => setBatchRejectNote(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full p-4 border-2 border-line rounded-xl text-sm font-bold text-ink placeholder:text-muted/50 focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none resize-none h-32"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setBatchRejectNote("");
                                }}
                                className="px-4 py-2 text-sm font-bold text-muted hover:text-ink"
                            >
                                Cancel
                            </button>
                            <PixelButton
                                onClick={handleBatchReject}
                                variant="outline-red"
                                size="sm"
                                disabled={!batchRejectNote.trim() || isBatchProcessing}
                            >
                                {isBatchProcessing ? "⏳ PROCESSING..." : "❌ REJECT ALL"}
                            </PixelButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
