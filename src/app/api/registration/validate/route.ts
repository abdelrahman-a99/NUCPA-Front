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
    return process.env.NUCPA_API_BASE_URL || process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL;
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

async function forward(req: Request) {
    const useAdmin = req.headers.get("X-Admin-Access") === "true";
    const COOKIE_ACCESS = useAdmin ? COOKIE_ACCESS_ADMIN : COOKIE_ACCESS_USER;
    const COOKIE_REFRESH = useAdmin ? COOKIE_REFRESH_ADMIN : COOKIE_REFRESH_USER;

    const c = cookies();
    const access = c.get(COOKIE_ACCESS)?.value;
    const refresh = c.get(COOKIE_REFRESH)?.value;

    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = `${backendBase()}/registration/validate/${queryString ? `?${queryString}` : ""}`;

    const makeRequest = async (accessToken?: string) => {
        const headers = new Headers();
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        headers.set("Content-Type", "application/json");

        return fetch(url, { method: "GET", headers });
    };

    let res = await makeRequest(access);

    // Auto-refresh on 401 if we had a refresh token
    if (res.status === 401 && refresh) {
        const tokens = await refreshAccess(refresh);
        if (!tokens) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        res = await makeRequest(tokens.access);

        const body = await res.arrayBuffer();
        const out = new NextResponse(body, { status: res.status, headers: res.headers });
        // Use proper cookie settings same as team route
        out.cookies.set(COOKIE_ACCESS, tokens.access, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
        if (tokens.refresh) {
            out.cookies.set(COOKIE_REFRESH, tokens.refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
        }
        return out;
    }

    const body = await res.arrayBuffer();
    return new NextResponse(body, { status: res.status, headers: res.headers });
}

export async function GET(req: Request) {
    return forward(req);
}
