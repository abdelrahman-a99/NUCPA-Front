"use client";

import React from "react";
import PixelButton from "./PixelButton";
import { cn } from "@/lib/cn";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning";
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "CONFIRM",
    cancelLabel = "CANCEL",
    variant = "warning",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-xl2 border border-line shadow-2xl p-8 sm:p-10 animate-in zoom-in-95 fade-in duration-300">
                <div className="flex flex-col items-center text-center gap-6">
                    {/* Icon/Indicator */}
                    <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center mb-2",
                        variant === "danger" ? "bg-red/10 text-red" : "bg-teal-bright/10 text-teal-bright"
                    )}>
                        <svg
                            className="w-10 h-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-pixel text-2xl text-ink uppercase tracking-tight">
                            {title}
                        </h3>
                        <p className="text-muted font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-4 mt-2">
                        <PixelButton
                            onClick={onCancel}
                            variant="primary"
                            size="sm"
                            className="min-w-[120px]"
                        >
                            {cancelLabel}
                        </PixelButton>
                        <PixelButton
                            onClick={onConfirm}
                            variant={variant === "danger" ? "outline-red" : "primary"}
                            size="sm"
                            className="min-w-[120px]"
                        >
                            {confirmLabel}
                        </PixelButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
