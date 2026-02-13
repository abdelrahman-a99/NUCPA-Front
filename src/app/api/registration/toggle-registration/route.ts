import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_ACCESS = "nucpa_admin_access";
const COOKIE_REFRESH = "nucpa_admin_refresh";

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

export async function POST(req: Request) {
    const c = cookies();
    const access = c.get(COOKIE_ACCESS)?.value;
    const refresh = c.get(COOKIE_REFRESH)?.value;

    if (!access && !refresh) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    const url = `${backendBase()}/registration/toggle-registration/`;

    const makeRequest = async (accessToken?: string) => {
        const headers = new Headers();
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        headers.set("Content-Type", "application/json");
        return fetch(url, { method: "POST", headers });
    };

    let res = await makeRequest(access);

    if (res.status === 401 && refresh) {
        const tokens = await refreshAccess(refresh);
        if (!tokens) return new NextResponse("Unauthenticated", { status: 401 });

        res = await makeRequest(tokens.access);

        const data = await res.json();
        const out = NextResponse.json(data, { status: res.status });
        out.cookies.set(COOKIE_ACCESS, tokens.access, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
        if (tokens.refresh) {
            out.cookies.set(COOKIE_REFRESH, tokens.refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
        }
        return out;
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
