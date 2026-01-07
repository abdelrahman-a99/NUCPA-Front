import React from 'react';
import PixelButton from '@/components/ui/PixelButton';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isSuccess?: boolean; // New prop to change style/icon for success messages
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "Do you want to proceed?",
    confirmText = "Yes, Confirm",
    cancelText = "Cancel",
    isSuccess = false
}: ConfirmationModalProps) {

    if (!isOpen) return null;

    // Use portal to render at body level
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`relative w-full max-w-md bg-white border-4 ${isSuccess ? 'border-teal' : 'border-ink'} rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>

                {/* Header */}
                <div className={`${isSuccess ? 'bg-teal' : 'bg-ink'} p-6 flex justify-between items-center border-b-4 ${isSuccess ? 'border-teal-dark' : 'border-ink/80'}`}>
                    <h2 className="font-pixel text-xl text-white tracking-wide uppercase">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors font-bold text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 bg-dots-about text-center">
                    {isSuccess ? (
                        <div className="mb-4 text-4xl">🎉</div>
                    ) : (
                        <div className="mb-4 text-4xl">⚠️</div>
                    )}
                    <p className="font-medium text-lg text-ink2 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t-2 border-line flex justify-center gap-4">
                    {!isSuccess && (
                        <PixelButton
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                        >
                            {cancelText}
                        </PixelButton>
                    )}

                    <PixelButton
                        onClick={() => {
                            if (isSuccess) {
                                onClose();
                            } else {
                                onConfirm();
                            }
                        }}
                        variant={isSuccess ? "primary" : "primary"}
                        size="sm"
                        className={!isSuccess ? "bg-red-500 hover:bg-red-600 border-red-700 text-white" : ""}
                    >
                        {isSuccess ? "OK, GREAT!" : confirmText}
                    </PixelButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
