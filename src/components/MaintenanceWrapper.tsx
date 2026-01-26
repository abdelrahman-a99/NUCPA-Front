"use client";

// =====================================================
// MAINTENANCE MODE CONFIGURATION
// Set this to true to enable maintenance mode
// Set to false to disable maintenance mode
// =====================================================
export const MAINTENANCE_MODE = true;
// =====================================================

export default function RegistrationMaintenance() {
    return (
        <div className="flex flex-col items-center gap-8 text-center py-8">
            {/* Icon */}
            <div className="bg-amber-500/10 p-6 rounded-full mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ink font-pixel">SYSTEM MAINTENANCE</h2>
                <p className="text-muted max-w-md mx-auto font-medium">
                    We&apos;re performing scheduled maintenance to improve our services.
                    Registration will be back online shortly.
                </p>
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                    </div>
                    <p className="text-amber-700 text-sm font-medium">
                        Maintenance in progress. Your data is safe.
                    </p>
                </div>
            </div>

            {/* Return home button */}
            <div className="mt-4">
                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-bright text-white font-pixel text-sm rounded-lg hover:bg-teal-600 transition-colors"
                >
                    RETURN HOME
                </a>
            </div>
        </div>
    );
}
