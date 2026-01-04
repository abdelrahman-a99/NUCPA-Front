"use client";

import { useEffect, useState } from "react";

function getBackendBaseUrl() {
    return process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
}

export default function GoogleSuccessPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        async function completeLogin() {
            try {
                setDebugInfo("Finalizing login...");

                // The backend redirects here after setting the session cookie.
                // We need to fetch the tokens using the session cookie.
                const backendBase = getBackendBaseUrl();
                const res = await fetch(`${backendBase}/registration/auth/google/success/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Send cookies
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Backend error: ${res.status} ${text}`);
                }

                const data = await res.json();
                setDebugInfo("Login successful! Redirecting...");

                // Signal success to the opener window
                if (window.opener) {
                    window.opener.postMessage(
                        {
                            type: "NUCPA_AUTH_SUCCESS",
                            payload: data,
                        },
                        window.location.origin
                    );

                    // Fallback: Write to localStorage for broader support
                    localStorage.setItem("nucpa_auth_signal", JSON.stringify({ type: "success", payload: data }));
                } else {
                    // Fallback for mobile/same-window flows: Write to storage and maybe redirect manually
                    localStorage.setItem("nucpa_auth_signal", JSON.stringify({ type: "success", payload: data }));
                }

                setStatus("success");
                setTimeout(() => window.close(), 1000);

            } catch (e: any) {
                console.error("Success Page Error:", e);
                setDebugInfo(e?.message || "Unknown error");
                setStatus("error");

                if (window.opener) {
                    window.opener.postMessage(
                        {
                            type: "NUCPA_AUTH_ERROR",
                            message: e?.message
                        },
                        window.location.origin
                    );
                }
                localStorage.setItem("nucpa_auth_signal", JSON.stringify({ type: "error", message: e?.message }));
            }
        }

        completeLogin();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 font-mono">
            <div className="max-w-md w-full border border-gray-800 p-6 rounded text-center">
                <h1 className="text-xl font-bold mb-4">
                    {status === "loading" && "Finalizing..."}
                    {status === "success" && "Success!"}
                    {status === "error" && "Login Failed"}
                </h1>
                <p className="text-xs text-gray-400 break-words text-left bg-gray-900 p-2 rounded">
                    {debugInfo}
                </p>
            </div>
        </div>
    );
}
