import { NextResponse } from "next/server";

const COOKIE_ACCESS = "nucpa_access";
const COOKIE_REFRESH = "nucpa_refresh";

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

    // Store tokens as HttpOnly cookies (best practice: prevents JS access/XSS token theft)
    res.cookies.set(COOKIE_ACCESS, access, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set(COOKIE_REFRESH, refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }
}
