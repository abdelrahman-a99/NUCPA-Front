import React, { useState } from 'react';
import PixelButton from '@/components/ui/PixelButton';
import { createPortal } from 'react-dom';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (rulesAccepted: boolean, dataSharingAccepted: boolean) => void;
}

export default function RulesModal({ isOpen, onClose, onAccept }: RulesModalProps) {
    const [rulesAgreed, setRulesAgreed] = useState(false);
    const [dataSharingAgreed, setDataSharingAgreed] = useState(false);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white border-4 border-teal rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-teal p-6 flex justify-between items-center border-b-4 border-teal-dark">
                    <h2 className="font-pixel text-2xl text-white tracking-wide">COMPETITION RULES</h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors font-bold text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[70vh] overflow-y-auto bg-dots-about">

                    {/* Section 1: Rules */}
                    <div className="mb-8">
                        <h3 className="font-pixel text-lg text-ink2 mb-4 uppercase border-b-2 border-line/50 pb-2 inline-block">
                            1. Competition Rules Consent
                        </h3>
                        <div className="bg-bg/50 p-4 rounded-xl border-2 border-line/30 mb-4 text-sm font-medium text-muted leading-relaxed">
                            <p className="mb-2">
                                By submitting this application, I confirm that I have read, understood, and agree to comply with the NUCPA and ICPC competition rules and format.
                            </p>
                            <p>
                                I acknowledge that failure to adhere to these rules may result in disqualification or actions determined by the organizing committee.
                            </p>
                        </div>

                        <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-teal/5 transition-colors cursor-pointer border border-transparent hover:border-teal/20">
                            <input
                                type="checkbox"
                                checked={rulesAgreed}
                                onChange={(e) => setRulesAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-2 border-line text-teal focus:ring-teal cursor-pointer accent-teal checkbox-pixel"
                            />
                            <span className="text-sm font-bold text-ink">
                                I agree to the NUCPA & ICPC competition rules. <span className="text-red-500">*</span>
                            </span>
                        </label>
                    </div>

                    {/* Section 2: Data Sharing */}
                    <div className="mb-8">
                        <h3 className="font-pixel text-lg text-ink2 mb-4 uppercase border-b-2 border-line/50 pb-2 inline-block">
                            2. Data Sharing Consent
                        </h3>
                        <div className="bg-bg/50 p-4 rounded-xl border-2 border-line/30 mb-4 text-sm font-medium text-muted leading-relaxed">
                            <p className="mb-2">
                                By selecting this option, I consent to sharing my provided information with NUCPA and ICPC sponsors and partners for the purpose of potential internships, training opportunities, and job offers.
                            </p>
                            <p>
                                I understand that choosing not to agree will not affect my participation in the competition.
                            </p>
                        </div>

                        <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-teal/5 transition-colors cursor-pointer border border-transparent hover:border-teal/20">
                            <input
                                type="checkbox"
                                checked={dataSharingAgreed}
                                onChange={(e) => setDataSharingAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-2 border-line text-teal focus:ring-teal cursor-pointer accent-teal checkbox-pixel"
                            />
                            <span className="text-sm font-bold text-ink">
                                I agree to share my data with sponsors and partners for career opportunities.
                            </span>
                        </label>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t-2 border-line flex justify-end gap-4">
                    <PixelButton
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >
                        CANCEL
                    </PixelButton>
                    <PixelButton
                        onClick={() => onAccept(rulesAgreed, dataSharingAgreed)}
                        variant="primary"
                        size="sm"
                        disabled={!rulesAgreed}
                        className={!rulesAgreed ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        CONFIRM & PROCEED
                    </PixelButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
