import { NextResponse } from "next/server";

function backendBase() {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:8000";
    }
    return process.env.NUCPA_API_BASE_URL || process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL;
}

export async function GET() {
    try {
        const res = await fetch(`${backendBase()}/registration/registration-status/`, {
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error("[Registration Status API] Error:", error.message || error);
        return NextResponse.json(
            { error: "Backend connection failed", registration_open: true },
            { status: 502 }
        );
    }
}
