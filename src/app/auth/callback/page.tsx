"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const access = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (access && refresh) {
      if (window.opener) {
        // If we are in a popup, message the opener
        window.opener.postMessage({
          type: "NUCPA_AUTH",
          payload: { access, refresh }
        }, "*"); // Be more specific with origin in production if possible, but '*' works for now
        window.close();
      } else {
        // Fallback if not a popup (e.g. mobile or direct visit) - store and redirect
        fetch("/api/auth/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access, refresh }),
        })
          .then(() => router.push("/registration"))
          .catch(() => router.push("/?error=auth_failed"));
      }
    } else {
      // Only redirect to error if we truly failed to get params after a short delay or check
      // But typically if params are missing here, it's an error state
      if (!access && !refresh) {
        // Check if we are stuck or just loading... next router is fast though.
        // router.push("/?error=missing_tokens");
      }
    }
  }, [params, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="font-pixel text-2xl text-teal-bright animate-pulse">
          AUTHENTICATING...
        </h1>
        <p className="text-muted mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
