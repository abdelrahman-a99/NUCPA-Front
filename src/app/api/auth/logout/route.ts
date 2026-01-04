import { NextResponse } from "next/server";

const COOKIE_ACCESS = "nucpa_access";
const COOKIE_REFRESH = "nucpa_refresh";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ACCESS, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_REFRESH, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
