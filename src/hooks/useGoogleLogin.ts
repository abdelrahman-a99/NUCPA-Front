"use client";

import { useEffect, useRef, useState } from "react";
import { parseErrorMessage } from "@/utils/errorHelpers";

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL;
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
    localStorage.removeItem("nucpa_auth_signal");
    cleanup();
    setIsLoading(false);
    if (onSuccess) onSuccess();
  }

  function handleError(msg: string) {
    localStorage.removeItem("nucpa_auth_signal");
    cleanup();
    setIsLoading(false);
    setError(parseErrorMessage(msg));
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
    if (event.data?.type === "NUCPA_AUTH_SUCCESS" || event.data?.type === "NUCPA_AUTH") {
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
            handleSuccess();
            return;
          } else if (signal.type === "error") {
            handleError(signal.message);
          }
        } catch (e) {
          console.error("[useGoogleLogin] Failed to parse storage signal:", e);
        }
      }

      if (authPopupRef.current && authPopupRef.current.closed) {
        if (!isLoading) return;
        cleanup();
        setIsLoading(false);
      }
    }, 500);
  }

  return { login, isLoading, error };
}
