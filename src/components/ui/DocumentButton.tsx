/* eslint-disable @next/next/no-img-element */
import React from "react";

interface DocumentButtonProps {
    url: string | null | undefined;
    label: string;
    className?: string;
}

export default function DocumentButton({ url, label, className }: DocumentButtonProps) {
    const [loading, setLoading] = React.useState(false);

    const handleView = async () => {
        if (!url) return;
        setLoading(true);
        try {
            // Use our BFF proxy which handles the cookies & auth
            const proxyUrl = `/api/registration/documents?url=${encodeURIComponent(url)}`;

            const res = await fetch(proxyUrl);
            if (!res.ok) throw new Error("Failed to load document");

            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");

            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } catch (e) {
            console.error(e);
            alert("Could not load document.");
        } finally {
            setLoading(false);
        }
    };

    if (!url) return null;

    return (
        <button
            onClick={(e) => { e.preventDefault(); handleView(); }}
            disabled={loading}
            className={className || "text-xs text-teal hover:underline font-bold disabled:opacity-50"}
        >
            {loading ? "OPENING..." : label}
        </button>
    );
}
