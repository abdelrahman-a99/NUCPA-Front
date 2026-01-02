import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_ACCESS = "nucpa_access";
const COOKIE_REFRESH = "nucpa_refresh";

function backendBase() {
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

async function forward(req: Request, method: string) {
  const c = cookies();
  const access = c.get(COOKIE_ACCESS)?.value;
  const refresh = c.get(COOKIE_REFRESH)?.value;

  if (!access && !refresh) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  const url = `${backendBase()}/registration/teams/`;

  const makeRequest = async (accessToken?: string) => {
    const headers = new Headers();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    if (method === "POST") {
      const form = await req.formData();
      return fetch(url, { method, headers, body: form });
    }

    return fetch(url, { method, headers });
  };

  let res = await makeRequest(access);

  // Auto-refresh on 401
  if (res.status === 401 && refresh) {
    const tokens = await refreshAccess(refresh);
    if (!tokens) return new NextResponse("Unauthenticated", { status: 401 });

    res = await makeRequest(tokens.access);

    const body = await res.arrayBuffer();
    const out = new NextResponse(body, { status: res.status, headers: res.headers });
    out.cookies.set(COOKIE_ACCESS, tokens.access, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
    if (tokens.refresh) {
      out.cookies.set(COOKIE_REFRESH, tokens.refresh, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
    }
    return out;
  }

  const body = await res.arrayBuffer();
  return new NextResponse(body, { status: res.status, headers: res.headers });
}

export async function GET(req: Request) {
  return forward(req, "GET");
}

export async function POST(req: Request) {
  return forward(req, "POST");
}
