"use client";

import { useEffect, useState } from "react";

function getBackendBaseUrl() {
    return process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
}

export default function GoogleCallbackPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        async function fetchTokens() {
            try {
                setDebugInfo("Fetching tokens from backend...");

                // The user is redirected here after Google login on the backend.
                // The backend should have set a session cookie.
                // We now call the success endpoint to get the JWTs.
                const backendBase = getBackendBaseUrl();
                const res = await fetch(`${backendBase}/registration/auth/google/success/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // IMPORTANT: This allows sending the session cookie (if Set-Cookie was SameSite=None)
                    credentials: "include",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Backend error: ${res.status} ${text}`);
                }

                const data = await res.json();
                setDebugInfo("Tokens received. Sending to main window...");

                if (window.opener) {
                    // Send tokens to the main window
                    window.opener.postMessage(
                        {
                            type: "NUCPA_AUTH",
                            payload: data, // { access, refresh, user }
                        },
                        window.location.origin // Target origin: must be same as this page
                    );

                    setStatus("success");
                    setTimeout(() => window.close(), 1000);
                } else {
                    throw new Error("No opener window found. Cannot pass tokens.");
                }

            } catch (e: any) {
                console.error("Callback Error:", e);
                setDebugInfo(e?.message || "Unknown error");
                setStatus("error");
            }
        }

        fetchTokens();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 font-mono">
            <div className="max-w-md w-full border border-gray-800 p-6 rounded text-center">
                <h1 className="text-xl font-bold mb-4">
                    {status === "loading" && "Authenticating..."}
                    {status === "success" && "Login Successful!"}
                    {status === "error" && "Login Failed"}
                </h1>

                <p className="text-xs text-gray-400 break-words text-left bg-gray-900 p-2 rounded">
                    {debugInfo}
                </p>

                {status === "success" && (
                    <p className="mt-4 text-sm text-green-400">Closing window...</p>
                )}

                {status === "error" && (
                    <button
                        onClick={() => window.close()}
                        className="mt-4 px-4 py-2 bg-red-600 rounded text-sm hover:bg-red-700"
                    >
                        Close Window
                    </button>
                )}
            </div>
        </div>
    );
}
