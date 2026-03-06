"use client";

import { useEffect, useRef, useState } from "react";

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "http://127.0.0.1:8000";
}

type UseGoogleLoginProps = {
  onSuccess?: () => void;
};

export function useGoogleLogin({ onSuccess }: UseGoogleLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authPopupRef = useRef<Window | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (channelRef.current) channelRef.current.close();
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  function cleanup() {
    console.log("[useGoogleLogin] Cleanup triggered.");
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    window.removeEventListener("message", handleMessage);
    window.removeEventListener("storage", handleStorageEvent);

    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }

    if (authPopupRef.current && !authPopupRef.current.closed) {
      authPopupRef.current.close();
      authPopupRef.current = null;
    }
  }

  function handleSuccess() {
    console.log("[useGoogleLogin] Login SUCCESS detected.");
    localStorage.removeItem("nucpa_auth_signal");
    cleanup();
    setIsLoading(false);
    if (onSuccess) onSuccess();
  }

  function handleError(msg: string) {
    console.error("[useGoogleLogin] Login ERROR detected:", msg);
    localStorage.removeItem("nucpa_auth_signal");
    cleanup();
    setIsLoading(false);
    setError(msg);
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === "nucpa_auth_signal" && event.newValue) {
      try {
        const signal = JSON.parse(event.newValue);
        if (signal.type === "success") {
          handleSuccess();
        } else if (signal.type === "error") {
          handleError(signal.message);
        }
      } catch (e) {
        console.error("[useGoogleLogin] Failed to parse storage signal:", e);
      }
    }
  }

  function handleMessage(event: MessageEvent) {
    if (event.data?.type === "NUCPA_AUTH_SUCCESS") {
      console.log("[useGoogleLogin] Received success signal via postMessage.");
      handleSuccess();
    }
  }

  function login() {
    setError(null);
    setIsLoading(true);
    localStorage.removeItem("nucpa_auth_signal");

    const backendBase = getBackendBaseUrl();
    // Pass current origin to backend so it knows where to redirect (handles port 3000 vs 3001)
    const successUrl = `/registration/auth/google/success/?mode=popup&frontend=${encodeURIComponent(window.location.origin)}`;
    const encodedSuccessUrl = encodeURIComponent(successUrl);
    const url = `${backendBase}/accounts/google/login/?next=${encodedSuccessUrl}`;

    console.log("[useGoogleLogin] Opening popup:", url);

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
      return;
    }

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorageEvent);

    try {
      channelRef.current = new BroadcastChannel("nucpa_auth_channel");
      channelRef.current.onmessage = (event) => {
        if (event.data?.type === "NUCPA_AUTH_SUCCESS") {
          console.log("[useGoogleLogin] Received success signal via BroadcastChannel.");
          handleSuccess();
        }
      };
    } catch (e) {
      console.warn("[useGoogleLogin] BroadcastChannel not supported.");
    }

    pollTimerRef.current = setInterval(() => {
      // Check for localStorage signal constantly (in case storage event was missed)
      const signalRaw = localStorage.getItem("nucpa_auth_signal");
      if (signalRaw) {
        try {
          const signal = JSON.parse(signalRaw);
          if (signal.type === "success") {
            console.log("[useGoogleLogin] Polling found SUCCESS signal.");
            handleSuccess();
            return;
          } else if (signal.type === "error") {
            // ... error handling
          }
        } catch (e) {
          // ignore
        }
      }

      if (authPopupRef.current && authPopupRef.current.closed) {
        console.log("[useGoogleLogin] Popup closed. Checking for final signal...");
        // Give a small grace period or check one last time?
        // We already checked above. If no signal led yet, we assume user closed it manually OR
        // the callback wrote the signal but we missed the event.

        // Let's do a double check with a slight delay before giving up? 
        // Or just fail.

        // Use a counter or timestamp to wait a bit after closure? 
        // For now, let's just cleanup if we really didn't see anything.

        if (!isLoading) return; // already handled

        console.log("[useGoogleLogin] Popup closed without signal (or handled elsewhere).");
        cleanup();
        setIsLoading(false);
      }
    }, 500);
  }

  return { login, isLoading, error };
}
