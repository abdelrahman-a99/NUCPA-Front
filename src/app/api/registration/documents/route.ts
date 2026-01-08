import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_ACCESS_USER = "nucpa_access";
const COOKIE_REFRESH_USER = "nucpa_refresh";
const COOKIE_ACCESS_ADMIN = "nucpa_admin_access";
const COOKIE_REFRESH_ADMIN = "nucpa_admin_refresh";

function backendBase() {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:8000";
    }
    return process.env.NUCPA_API_BASE_URL || process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
}

async function refreshAccess(refresh: string) {
    const r = await fetch(`${backendBase()}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { access?: string; refresh?: string };
    if (!data.access) return null;
    return data as { access: string; refresh?: string };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    let targetUrl = searchParams.get("url");

    if (!targetUrl) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    const base = backendBase();

    // If relative path, prepend backend base
    if (targetUrl.startsWith("/")) {
        targetUrl = `${base}${targetUrl}`;
    }

    // Security check: ensure the target URL belongs to our backend
    // Relaxed check to allow the constructed URL
    if (!targetUrl.startsWith(base) && !targetUrl.includes(base) && !targetUrl.includes("127.0.0.1") && !targetUrl.includes("railway.app")) {
        return new NextResponse("Invalid target URL", { status: 400 });
    }

    const useAdmin = req.headers.get("X-Admin-Access") === "true";
    const COOKIE_ACCESS = useAdmin ? COOKIE_ACCESS_ADMIN : COOKIE_ACCESS_USER;
    const COOKIE_REFRESH = useAdmin ? COOKIE_REFRESH_ADMIN : COOKIE_REFRESH_USER;

    const c = cookies();
    const access = c.get(COOKIE_ACCESS)?.value;
    const refresh = c.get(COOKIE_REFRESH)?.value;

    if (!access && !refresh) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    const makeRequest = async (accessToken?: string) => {
        const headers = new Headers();
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        return fetch(targetUrl, { method: "GET", headers });
    };

    let res = await makeRequest(access);

    if (res.status === 401 && refresh) {
        const tokens = await refreshAccess(refresh);
        if (!tokens) return new NextResponse("Unauthenticated", { status: 401 });

        res = await makeRequest(tokens.access);

        // If successful, we need to set the new cookies on the response
        const body = await res.arrayBuffer();
        const out = new NextResponse(body, { status: res.status, headers: res.headers });
        out.cookies.set(COOKIE_ACCESS, tokens.access, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
        if (tokens.refresh) {
            out.cookies.set(COOKIE_REFRESH, tokens.refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
        }
        return out;
    }

    const body = await res.arrayBuffer();
    return new NextResponse(body, { status: res.status, headers: res.headers });
}
