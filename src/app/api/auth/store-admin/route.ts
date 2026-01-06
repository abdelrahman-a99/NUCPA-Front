import { NextResponse } from "next/server";

const COOKIE_ACCESS = "nucpa_admin_access";
const COOKIE_REFRESH = "nucpa_admin_refresh";

export async function POST(req: Request) {
    try {
        const { access, refresh } = (await req.json()) as {
            access?: string;
            refresh?: string;
        };

        if (!access || !refresh) {
            return new NextResponse("Missing access/refresh tokens", { status: 400 });
        }

        const res = NextResponse.json({ ok: true });

        // Store tokens as HttpOnly cookies (persistent for 20 minutes)
        // 20 minutes = 1200 seconds
        const MAX_AGE = 60 * 20;

        res.cookies.set(COOKIE_ACCESS, access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: MAX_AGE,
        });

        res.cookies.set(COOKIE_REFRESH, refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: MAX_AGE,
        });

        return res;
    } catch {
        return new NextResponse("Invalid JSON", { status: 400 });
    }
}
