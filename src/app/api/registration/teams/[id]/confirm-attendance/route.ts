import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_ACCESS_USER = "nucpa_access";
const COOKIE_REFRESH_USER = "nucpa_refresh";

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

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const c = cookies();
  const access = c.get(COOKIE_ACCESS_USER)?.value;
  const refresh = c.get(COOKIE_REFRESH_USER)?.value;
  if (!access && !refresh) return new NextResponse("Unauthenticated", { status: 401 });

  const url = `${backendBase()}/registration/teams/${ctx.params.id}/confirm-attendance/`;
  const body = await req.text();

  const makeRequest = async (accessToken?: string) => {
    const headers = new Headers();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    headers.set("Content-Type", "application/json");
    return fetch(url, { method: "POST", headers, body });
  };

  let res = await makeRequest(access);

  if (res.status === 401 && refresh) {
    const tokens = await refreshAccess(refresh);
    if (!tokens) return new NextResponse("Unauthenticated", { status: 401 });
    res = await makeRequest(tokens.access);
    const resBody = await res.arrayBuffer();
    const out = new NextResponse(resBody, { status: res.status, headers: res.headers });
    out.cookies.set(COOKIE_ACCESS_USER, tokens.access, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
    if (tokens.refresh) {
      out.cookies.set(COOKIE_REFRESH_USER, tokens.refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
    }
    return out;
  }

  const resBody = await res.arrayBuffer();
  return new NextResponse(resBody, { status: res.status, headers: res.headers });
}
