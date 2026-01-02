"use client";

import { useEffect, useRef, useState, useMemo } from "react";

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
}

type UseGoogleLoginProps = {
  onSuccess?: () => void;
};

export function useGoogleLogin({ onSuccess }: UseGoogleLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authPopupRef = useRef<Window | null>(null);

  const popupTargetOrigin = useMemo(() => {
    try {
      return new URL(getBackendBaseUrl()).origin;
    } catch {
      return "https://nucpa-regestration-production.up.railway.app";
    }
  }, []);

  useEffect(() => {
    // Listen for tokens from backend popup OR frontend callback page.
    function onMessage(ev: MessageEvent) {
      // Accept message if it comes from backend (old way) OR current origin (new callback page)
      const allowed = [popupTargetOrigin, window.location.origin];

      console.log("GoogleLogin: Message received from", ev.origin, "Allowed:", allowed);

      if (!allowed.includes(ev.origin)) {
        console.warn("Origin not allowed:", ev.origin);
        return;
      }

      const data = ev.data;
      if (!data || data.type !== "NUCPA_AUTH" || !data.payload) {
        // console.log("Ignored message:", data);
        return;
      }

      console.log("Received auth message:", data);

      const { access, refresh } = data.payload as { access?: string; refresh?: string };
      if (!access || !refresh) {
        console.error("Missing tokens in payload");
        setError("Login succeeded but tokens were missing.");
        setIsLoading(false);
        return;
      }

      // Store securely in HttpOnly cookies (server-side).
      fetch("/api/auth/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access, refresh }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error(await r.text());
          setIsLoading(false);
          if (onSuccess) onSuccess();
        })
        .catch((e) => {
          setError(e?.message || "Failed to store login tokens.");
          setIsLoading(false);
        });

      if (authPopupRef.current) {
        authPopupRef.current.close();
        authPopupRef.current = null;
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [popupTargetOrigin, onSuccess]);

  function login() {
    setError(null);
    setIsLoading(true);

    const backendBase = getBackendBaseUrl();
    const nextPath = "/registration/auth/google/success/?mode=popup";
    const url = `${backendBase}/accounts/google/login/?process=login&next=${encodeURIComponent(nextPath)}`;

    const w = 520;
    const h = 680;
    const left = Math.max(0, window.screenX + (window.outerWidth - w) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - h) / 2);

    authPopupRef.current = window.open(
      url,
      "nucpa_google_login",
      `popup=yes,width=${w},height=${h},left=${left},top=${top}`
    );

    if (!authPopupRef.current) {
      setIsLoading(false);
      setError("Popup blocked. Please allow popups and try again.");
    }
  }

  return { login, isLoading, error };
}
