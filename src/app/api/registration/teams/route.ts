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
  const url = process.env.NUCPA_API_BASE_URL || process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL;
  console.log("[Teams API] Backend URL:", url || "NOT SET!");
  return url;
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
  const useAdmin = req.headers.get("X-Admin-Access") === "true";
  const COOKIE_ACCESS = useAdmin ? COOKIE_ACCESS_ADMIN : COOKIE_ACCESS_USER;
  const COOKIE_REFRESH = useAdmin ? COOKIE_REFRESH_ADMIN : COOKIE_REFRESH_USER;

  const c = cookies();
  const access = c.get(COOKIE_ACCESS)?.value;
  const refresh = c.get(COOKIE_REFRESH)?.value;

  if (!access && !refresh) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();
  const url = `${backendBase()}/registration/teams/${queryString ? `?${queryString}` : ""}`;
  console.log("[Teams API] Fetching:", url);

  // Read body if needed
  let reqBody: any = undefined;
  let contentType: string | undefined = undefined;

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      reqBody = await req.formData();
      // When skipping content-type for FormData, fetch adds the boundary automatically
      contentType = undefined;
    } else {
      reqBody = await req.text();
    }
  }

  const makeRequest = async (accessToken?: string) => {
    const headers = new Headers();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    if (contentType) headers.set("Content-Type", contentType);

    const options: RequestInit = { method, headers };
    if (reqBody) options.body = reqBody;

    return fetch(url, options);
  };

  let res = await makeRequest(access);

  // Auto-refresh on 401
  if (res.status === 401 && refresh) {
    const tokens = await refreshAccess(refresh);
    if (!tokens) return new NextResponse("Unauthenticated", { status: 401 });

    res = await makeRequest(tokens.access);

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

export async function GET(req: Request) {
  try {
    return await forward(req, "GET");
  } catch (error: any) {
    console.error("[Teams API GET] Error:", error.message || error);
    return new NextResponse(
      JSON.stringify({ error: "Backend connection failed", details: error.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    return await forward(req, "POST");
  } catch (error: any) {
    console.error("[Teams API POST] Error:", error.message || error);
    return new NextResponse(
      JSON.stringify({ error: "Backend connection failed", details: error.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

