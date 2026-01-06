"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PixelButton from "@/components/ui/PixelButton";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useAdmin();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            router.push("/admin-portal/dashboard");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-bg">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-12 px-4 bg-dots-about">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-8">
                        <h1 className="font-pixel text-3xl sm:text-5xl text-teal-bright pixel-outline mb-2">
                            ADMIN ACCESS
                        </h1>
                        <p className="text-muted text-sm font-bold uppercase tracking-widest">
                            Authorized Personnel Only
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white border-2 border-line p-8 rounded-3xl shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red/5 border border-red/20 text-red text-sm font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-bg border border-line focus:border-teal outline-none transition-all font-medium"
                                    placeholder="Enter admin username"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-bg border border-line focus:border-teal outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <PixelButton
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-4 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "AUTHENTICATING..." : "SYSTEM LOGIN"}
                                </PixelButton>
                            </div>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-xs text-muted font-bold uppercase tracking-widest opacity-50">
                        &copy; 2026 Nile University Coding Arena
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
