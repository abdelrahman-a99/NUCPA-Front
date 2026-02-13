"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RegistrationClosedPage() {
    return (
        <main className="min-h-screen bg-bg relative overflow-hidden">
            <Navbar />

            {/* Dot background */}
            <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    {/* Lock Icon with animation */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-full shadow-lg shadow-red-500/30">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-ink font-pixel tracking-wide">
                            REGISTRATION CLOSED
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full" />
                    </div>

                    {/* Description */}
                    <p className="text-muted text-base md:text-lg max-w-md mx-auto leading-relaxed">
                        Registration for NUCPA is currently closed.
                        Please check back later or follow our social media channels for updates.
                    </p>

                    {/* Info box */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
                        <div className="flex items-center gap-3 text-left">
                            <div className="flex-shrink-0">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                                </span>
                            </div>
                            <p className="text-red-700 text-sm font-medium">
                                New team registrations are not being accepted at this time.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-bright text-white font-pixel text-sm rounded-lg hover:bg-teal-600 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            RETURN HOME
                        </Link>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-ink/20 text-ink font-pixel text-sm rounded-lg hover:border-teal-bright hover:text-teal-bright transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            CONTACT US
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
