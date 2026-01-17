import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// User cookies
const COOKIE_ACCESS_USER = "nucpa_access";
const COOKIE_REFRESH_USER = "nucpa_refresh";
// Admin cookies
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

function getAuthCookies(req: Request) {
    const useAdmin = req.headers.get("X-Admin-Access") === "true";
    const COOKIE_ACCESS = useAdmin ? COOKIE_ACCESS_ADMIN : COOKIE_ACCESS_USER;
    const COOKIE_REFRESH = useAdmin ? COOKIE_REFRESH_ADMIN : COOKIE_REFRESH_USER;

    const c = cookies();
    return {
        access: c.get(COOKIE_ACCESS)?.value,
        refresh: c.get(COOKIE_REFRESH)?.value,
        COOKIE_ACCESS,
        COOKIE_REFRESH
    };
}

export async function GET(
    req: Request,
    { params }: { params: { memberId: string; docType: string } }
) {
    const { memberId, docType } = params;
    const { access, refresh, COOKIE_ACCESS, COOKIE_REFRESH } = getAuthCookies(req);


    if (!access && !refresh) {
        return new NextResponse("Unauthenticated", { status: 401 });
    }

    const url = `${backendBase()}/registration/members/${memberId}/document/${docType}/`;

    const makeRequest = async (accessToken?: string) => {
        const headers = new Headers();
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        return fetch(url, { method: "GET", headers });
    };

    let res = await makeRequest(access);

    // Auto-refresh on 401
    if (res.status === 401 && refresh) {
        const tokens = await refreshAccess(refresh);
        if (!tokens) return new NextResponse("Unauthenticated", { status: 401 });

        res = await makeRequest(tokens.access);

        // Create streaming response
        const body = await res.arrayBuffer();
        const out = new NextResponse(body, {
            status: res.status,
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
                "Content-Disposition": res.headers.get("Content-Disposition") || "inline",
            }
        });

        // Update cookies
        out.cookies.set(COOKIE_ACCESS, tokens.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        if (tokens.refresh) {
            out.cookies.set(COOKIE_REFRESH, tokens.refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });
        }
        return out;
    }

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
            "Content-Disposition": res.headers.get("Content-Disposition") || "inline",
        }
    });
}

/**
 * DELETE handler - Deletes a member's document (admin only)
 */
export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string; docType: string } }
) {
    const { memberId, docType } = params;
    const { access, refresh, COOKIE_ACCESS, COOKIE_REFRESH } = getAuthCookies(req);

    if (!access && !refresh) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }


    const url = `${backendBase()}/registration/members/${memberId}/document/${docType}/`;

    const makeRequest = async (accessToken?: string) => {
        const headers = new Headers();
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        return fetch(url, { method: "DELETE", headers });
    };

    let res = await makeRequest(access);

    // Auto-refresh on 401
    if (res.status === 401 && refresh) {
        const tokens = await refreshAccess(refresh);
        if (!tokens) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

        res = await makeRequest(tokens.access);

        const data = await res.json().catch(() => ({}));
        const out = NextResponse.json(data, { status: res.status });

        // Update cookies
        out.cookies.set(COOKIE_ACCESS, tokens.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        if (tokens.refresh) {
            out.cookies.set(COOKIE_REFRESH, tokens.refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });
        }
        return out;
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

