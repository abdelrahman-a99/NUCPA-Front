"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const timestamp = Date.now();
      try {
        const hash = window.location.hash;
        const search = window.location.search;
        const urlParams = new URLSearchParams(search);

        let tokenB64 = "";
        if (hash && hash.includes("token=")) {
          const match = hash.match(/token=([^&]+)/);
          if (match) tokenB64 = match[1];
        }

        if (!tokenB64) {
          tokenB64 = urlParams.get("token") || "";
        }
        const directAccess = urlParams.get("access_token");
        const directRefresh = urlParams.get("refresh_token");

        let access = "";
        let refresh = "";

        if (tokenB64) {
          let payloadStr;
          try {
            const base64 = tokenB64.replace(/-/g, "+").replace(/_/g, "/");
            payloadStr = atob(base64);
          } catch (e) {
            throw new Error("Failed to decode base64 token: " + (e as Error).message);
          }

          let payload;
          try {
            payload = JSON.parse(payloadStr);
            access = payload.access || payload.access_token;
            refresh = payload.refresh || payload.refresh_token;
          } catch (e) {
            throw new Error("Failed to parse token JSON: " + (e as Error).message);
          }
        } else if (directAccess && directRefresh) {
          access = directAccess;
          refresh = directRefresh;
        }

        if (!access || !refresh) {
          throw new Error("Missing access or refresh tokens in URL");
        }

        const storeRes = await fetch("/api/auth/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access, refresh }),
        });

        if (!storeRes.ok) {
          throw new Error("Token storage failed with status " + storeRes.status);
        }

        localStorage.setItem("nucpa_auth_signal", JSON.stringify({
          type: "success",
          timestamp,
        }));

        try {
          const channel = new BroadcastChannel("nucpa_auth_channel");
          channel.postMessage({ type: "NUCPA_AUTH_SUCCESS", timestamp });
          channel.close();
        } catch (e) {
          console.warn("[Callback] BroadcastChannel failed:", e);
        }

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: "NUCPA_AUTH_SUCCESS", timestamp }, "*");
        }
        const isPopup = urlParams.get("mode") === "popup";

        if (isPopup || (window.opener && !window.opener.closed)) {
          try {
            if (window.opener && !window.opener.closed) {
              setTimeout(() => {
                try {
                  if (window.opener && !window.opener.closed) {
                    window.opener.location.href = window.location.origin + "/registration";
                  }
                } catch (e) {
                }
              }, 500);
            }
          } catch (e) {
            console.warn("[Callback] Opener access error:", e);
          }

          setTimeout(() => window.close(), 1000);
        } else {
          router.push("/registration");
        }

      } catch (e: any) {
        console.error("[Callback] Error:", e.message);
        localStorage.setItem("nucpa_auth_signal", JSON.stringify({
          type: "error",
          message: e.message,
          timestamp,
        }));

        if (window.opener && !window.opener.closed) {
          setTimeout(() => window.close(), 2000);
        } else {
          router.push("/");
        }
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "sans-serif",
      textAlign: "center"
    }}>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Completing Login...</p>
      <p style={{ color: "#666" }}>Please wait, this window will close automatically.</p>
    </div>
  );
}
