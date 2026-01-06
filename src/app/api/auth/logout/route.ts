import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_ACCESS = "nucpa_access";
const COOKIE_REFRESH = "nucpa_refresh";

function backendBase() {
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000";
  }
  return process.env.NUCPA_API_BASE_URL || process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
}

export async function POST(req: Request) {
  const c = cookies();
  const access = c.get(COOKIE_ACCESS)?.value || req.headers.get("Authorization")?.split(" ")[1] || "";

  // Attempt to notify backend for session cleanup
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (access) headers["Authorization"] = `Bearer ${access}`;

    const resBack = await fetch(`${backendBase()}/registration/auth/logout/`, {
      method: "POST",
      headers
    });
    console.log(`[Logout Proxy] Backend logout response: ${resBack.status}`);
  } catch (e) {
    console.error("[Logout Proxy] Backend logout failed:", e);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ACCESS, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_REFRESH, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
