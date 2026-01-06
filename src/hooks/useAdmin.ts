"use client";

import { useState, useCallback } from "react";
import { TeamDetails } from "@/lib/registration-data";

export function useAdmin() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teams, setTeams] = useState<TeamDetails[]>([]);

    const checkAdminStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/registration/check-admin/");
            if (res.ok) {
                const data = await res.json();
                setIsAdmin(data.is_admin);
            } else {
                setIsAdmin(false);
            }
        } catch (e) {
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Get tokens from backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "http://127.0.0.1:8000"}/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error("Invalid username or password");
            }

            const { access, refresh } = await res.json();

            // 2. Store tokens via frontend proxy API
            const storeRes = await fetch("/api/auth/store", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access, refresh }),
            });

            if (!storeRes.ok) {
                throw new Error("Failed to store session. Please try again.");
            }

            // 3. Verify admin status
            await checkAdminStatus();
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeams = useCallback(async (search?: string) => {
        setIsLoading(true);
        try {
            const query = search ? `?search=${encodeURIComponent(search)}` : "";
            const res = await fetch(`/api/registration/teams/${query}`);
            if (!res.ok) throw new Error("Failed to fetch teams");
            const data = await res.json();
            setTeams(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateTeamStatus = async (teamId: number, field: "payment_status" | "checked_in", value: boolean) => {
        try {
            const res = await fetch(`/api/registration/teams/${teamId}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: value }),
            });
            if (!res.ok) throw new Error(`Failed to update ${field}`);

            // Update local state
            setTeams(prev => prev.map(t => t.id === teamId ? { ...t, [field]: value } : t));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    };

    const deleteTeam = async (teamId: number) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this team? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/registration/teams/${teamId}/`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete team");

            setTeams(prev => prev.filter(t => t.id !== teamId));
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    };

    return {
        isAdmin,
        isLoading,
        error,
        teams,
        login,
        checkAdminStatus,
        fetchTeams,
        updateTeamStatus,
        deleteTeam,
    };
}
