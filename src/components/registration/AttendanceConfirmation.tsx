"use client";

import React, { useState } from "react";
import { TeamDetails } from "@/lib/registration-data";
import PixelButton from "@/components/ui/PixelButton";
import { parseErrorMessage } from "@/utils/errorHelpers";
import Image from "next/image";

type Package = "REG_ONLY" | "REG_1_TSHIRT" | "REG_2_TSHIRTS";
type Size = "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL" | "5XL" | "6XL";

// Pricing tiers based on NU student count
// 2 NU members: 0 / 250 / 450
// 1 NU member:  200 / 450 / 650
// 0 NU members: 400 / 650 / 850
function getPackages(nuMemberCount: number): { value: Package; label: string; price: string; priceNum: number; description: string; originalPrice?: string }[] {
    const discount = nuMemberCount * 200; // 200 EGP discount per NU student
    const regOnly = 400 - discount;
    const reg1Shirt = 650 - discount;
    const reg2Shirts = 850 - discount;

    return [
        {
            value: "REG_ONLY",
            label: regOnly === 0 ? "Registration Only (FREE)" : "Registration Only",
            price: regOnly === 0 ? "FREE" : `${regOnly} EGP`,
            priceNum: regOnly,
            description: "Contest entry for your team",
            originalPrice: discount > 0 ? "400 EGP" : undefined,
        },
        {
            value: "REG_1_TSHIRT",
            label: "Registration + 1 T-Shirt",
            price: `${reg1Shirt} EGP`,
            priceNum: reg1Shirt,
            description: "Contest entry + one official contestant t-shirt",
            originalPrice: discount > 0 ? "650 EGP" : undefined,
        },
        {
            value: "REG_2_TSHIRTS",
            label: "Registration + 2 T-Shirts",
            price: `${reg2Shirts} EGP`,
            priceNum: reg2Shirts,
            description: "Contest entry + two official contestant t-shirts",
            originalPrice: discount > 0 ? "850 EGP" : undefined,
        },
    ];
}

const SIZES: Size[] = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

export default function AttendanceConfirmation({
    team,
    onConfirmed,
}: {
    team: TeamDetails;
    onConfirmed: () => void;
}) {
    // Count NU student members
    const nuMemberCount = team.members.filter(m => m.nu_student).length;
    const packages = getPackages(nuMemberCount);

    const [attending, setAttending] = useState<boolean | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [tshirtSize1, setTshirtSize1] = useState<Size | "">("");
    const [tshirtSize2, setTshirtSize2] = useState<Size | "">("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Attending acknowledgements
    const [ackAttend, setAckAttend] = useState(false);
    const [ackFees, setAckFees] = useState(false);
    const [ackNoShow, setAckNoShow] = useState(false);

    // Declining acknowledgements
    const [ackDecline, setAckDecline] = useState(false);
    const [ackWaitlist, setAckWaitlist] = useState(false);

    const canSubmitAttend =
        attending === true &&
        selectedPackage &&
        ackAttend &&
        ackFees &&
        ackNoShow &&
        (selectedPackage === "REG_ONLY" || tshirtSize1) &&
        (selectedPackage !== "REG_2_TSHIRTS" || tshirtSize2);

    const canSubmitDecline = attending === false && ackDecline && ackWaitlist;

    const handleSubmit = async () => {
        setError(null);
        setSubmitting(true);

        try {
            const payload: any = { attending };
            if (attending) {
                payload.registration_package = selectedPackage;
                if (tshirtSize1) payload.tshirt_size_1 = tshirtSize1;
                if (tshirtSize2) payload.tshirt_size_2 = tshirtSize2;
            }

            const res = await fetch(`/api/registration/teams/${team.id}/confirm-attendance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Failed (${res.status})`);
            }

            setSuccess(true);
            onConfirmed();
        } catch (e) {
            setError(parseErrorMessage(e));
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-12 animate-in fade-in duration-500">
                <div className="text-5xl mb-4">{attending ? "🎉" : "👋"}</div>
                <h3 className="font-pixel text-2xl text-ink2 mb-2">
                    {attending ? "ATTENDANCE CONFIRMED!" : "WE UNDERSTAND"}
                </h3>
                <p className="text-muted font-medium">
                    {attending
                        ? "Thank you! Complete the payment to secure your spot."
                        : "Your spot has been released. We wish you the best!"}
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Congratulations Banner */}
            <div className="mb-8 p-6 bg-gradient-to-r from-teal/10 via-teal-bright/10 to-purple-500/10 border-2 border-teal/30 rounded-2xl text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-pixel text-2xl text-teal mb-2">CONGRATULATIONS!</h3>
                <p className="text-ink2 font-bold text-lg">
                    Your team <span className="text-teal">{team.team_name}</span> has qualified for the NUCPA 2026 Finals!
                </p>
                <p className="text-muted text-sm mt-2">Please confirm your attendance below.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-bold text-center">
                    {error}
                </div>
            )}

            {/* Attendance Choice */}
            <div className="mb-8">
                <h4 className="font-pixel text-lg text-ink2 mb-4">ATTENDANCE CONFIRMATION</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => {
                            setAttending(true);
                            setAckDecline(false);
                            setAckWaitlist(false);
                        }}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${attending === true
                            ? "border-teal bg-teal/5 shadow-md ring-4 ring-teal/20"
                            : "border-line bg-white hover:border-teal/50 hover:shadow-sm"
                            }`}
                    >
                        <div className="text-3xl mb-2">✅</div>
                        <h5 className="font-pixel text-base text-ink2 mb-1">WE WILL ATTEND</h5>
                        <p className="text-xs text-muted font-medium">Select a registration package and complete payment</p>
                        {attending === true && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                        )}
                    </button>

                    <button
                        onClick={() => {
                            setAttending(false);
                            setSelectedPackage(null);
                            setTshirtSize1("");
                            setTshirtSize2("");
                            setAckAttend(false);
                            setAckFees(false);
                            setAckNoShow(false);
                        }}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${attending === false
                            ? "border-red bg-red/5 shadow-md ring-4 ring-red/20"
                            : "border-line bg-white hover:border-red/30 hover:shadow-sm"
                            }`}
                    >
                        <div className="text-3xl mb-2">❌</div>
                        <h5 className="font-pixel text-base text-ink2 mb-1">WE WILL NOT ATTEND</h5>
                        <p className="text-xs text-muted font-medium">Our spot will be given to a team on the waiting list</p>
                        {attending === false && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-red rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                        )}
                    </button>
                </div>
            </div>

            {/* Attending Flow */}
            {attending === true && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Package Selection */}
                    <h4 className="font-pixel text-lg text-ink2 mb-4">REGISTRATION PACKAGES</h4>

                    {/* NU Student Discount Banner */}
                    {nuMemberCount > 0 && (
                        <div className="mb-4 p-4 bg-gradient-to-r from-teal/10 to-purple-500/10 border-2 border-teal/30 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                            <div className="text-2xl">🎓</div>
                            <div>
                                <p className="font-bold text-sm text-teal">
                                    NU Student Discount Applied! ({nuMemberCount} NU member{nuMemberCount > 1 ? "s" : ""})
                                </p>
                                <p className="text-xs text-muted">
                                    {nuMemberCount === 2
                                        ? "Both members are NU students — registration is FREE! Only pay for t-shirts."
                                        : "1 member is an NU student — 200 EGP discount on registration."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {packages.map((pkg) => (
                            <button
                                key={pkg.value}
                                onClick={() => {
                                    setSelectedPackage(pkg.value);
                                    if (pkg.value === "REG_ONLY") {
                                        setTshirtSize1("");
                                        setTshirtSize2("");
                                    }
                                    if (pkg.value !== "REG_2_TSHIRTS") {
                                        setTshirtSize2("");
                                    }
                                }}
                                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${selectedPackage === pkg.value
                                    ? "border-teal bg-teal/5 shadow-lg ring-4 ring-teal/20"
                                    : "border-line bg-white hover:border-teal/30 hover:shadow-sm"
                                    }`}
                            >
                                <div className="mb-3">
                                    {pkg.originalPrice && (
                                        <span className="text-sm text-muted line-through mr-2">{pkg.originalPrice}</span>
                                    )}
                                    <span className={`font-pixel text-2xl ${pkg.priceNum === 0 ? "text-green-600" : "text-teal"}`}>{pkg.price}</span>
                                    <span className="text-xs text-muted font-bold ml-1">/ team</span>
                                </div>
                                <h5 className="font-bold text-sm text-ink2 mb-1">{pkg.label}</h5>
                                <p className="text-xs text-muted">{pkg.description}</p>
                                {selectedPackage === pkg.value && (
                                    <div className="absolute top-3 right-3 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* T-shirt Design Preview */}
                    {selectedPackage && selectedPackage !== "REG_ONLY" && (
                        <div className="mb-8 animate-in fade-in duration-300">
                            <h4 className="font-pixel text-lg text-ink2 mb-4">T-SHIRT DESIGN</h4>
                            <div className="p-4 bg-white border-2 border-line rounded-2xl shadow-sm">
                                <div className="relative w-full max-w-lg mx-auto aspect-[16/9] rounded-xl overflow-hidden">
                                    <Image
                                        src="/tshirt-design.png"
                                        alt="NUCPA 2026 Contestant T-Shirt Design"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <p className="text-xs text-muted text-center mt-3 font-medium">
                                    ✍️ Write your name/handle with a marker on the back!
                                </p>
                            </div>

                            {/* Size Chart */}
                            <h4 className="font-pixel text-lg text-ink2 mt-6 mb-4">SIZE CHART</h4>
                            <div className="p-4 bg-white border-2 border-line rounded-2xl shadow-sm overflow-x-auto">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead>
                                        <tr className="bg-purple-700 text-white">
                                            <th className="px-4 py-3 rounded-tl-xl font-pixel text-xs">Size</th>
                                            <th className="px-4 py-3 font-pixel text-xs">Length (cm)</th>
                                            <th className="px-4 py-3 font-pixel text-xs">Width (cm)</th>
                                            <th className="px-4 py-3 rounded-tr-xl font-pixel text-xs">Weight (kg)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { size: "S", length: 68, width: 52, weight: 60 },
                                            { size: "M", length: 70, width: 54, weight: 70 },
                                            { size: "L", length: 72, width: 56, weight: 80 },
                                            { size: "XL", length: 74, width: 58, weight: 90 },
                                            { size: "2XL", length: 76, width: 60, weight: 100 },
                                            { size: "3XL", length: 78, width: 62, weight: 110 },
                                            { size: "4XL", length: 80, width: 64, weight: 120 },
                                            { size: "5XL", length: 82, width: 66, weight: 130 },
                                            { size: "6XL", length: 84, width: 68, weight: 140 },
                                        ].map((row, i) => (
                                            <tr key={row.size} className={i % 2 === 0 ? "bg-purple-50/50" : "bg-white"}>
                                                <td className="px-4 py-2.5 font-bold text-purple-700">{row.size}</td>
                                                <td className="px-4 py-2.5 text-ink2 font-medium">{row.length}</td>
                                                <td className="px-4 py-2.5 text-ink2 font-medium">{row.width}</td>
                                                <td className="px-4 py-2.5 text-ink2 font-medium">{row.weight}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* T-shirt Size Selection */}
                    {selectedPackage && selectedPackage !== "REG_ONLY" && (
                        <div className="mb-8 animate-in fade-in duration-300">
                            <h4 className="font-pixel text-lg text-ink2 mb-4">T-SHIRT SIZE</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
                                        {selectedPackage === "REG_2_TSHIRTS" ? "First T-Shirt Size" : "T-Shirt Size"}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {SIZES.map((size) => (
                                            <button
                                                key={`s1-${size}`}
                                                onClick={() => setTshirtSize1(size)}
                                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tshirtSize1 === size
                                                    ? "bg-teal text-white shadow-md"
                                                    : "bg-white border-2 border-line text-ink2 hover:border-teal/50"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedPackage === "REG_2_TSHIRTS" && (
                                    <div className="animate-in fade-in duration-300">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
                                            Second T-Shirt Size
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {SIZES.map((size) => (
                                                <button
                                                    key={`s2-${size}`}
                                                    onClick={() => setTshirtSize2(size)}
                                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tshirtSize2 === size
                                                        ? "bg-teal text-white shadow-md"
                                                        : "bg-white border-2 border-line text-ink2 hover:border-teal/50"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Attending Acknowledgements */}
                    <div className="mb-8 p-5 bg-bg/50 border border-line rounded-2xl space-y-3">
                        <h4 className="font-pixel text-sm text-ink2 mb-2">PLEASE ACKNOWLEDGE</h4>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={ackAttend}
                                onChange={(e) => setAckAttend(e.target.checked)}
                                className="w-5 h-5 mt-0.5 text-teal rounded border-gray-300 focus:ring-teal shrink-0"
                            />
                            <span className="text-sm text-ink2 font-medium group-hover:text-teal transition-colors">
                                I confirm that my team will attend the competition and complete the selected registration package.
                            </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={ackFees}
                                onChange={(e) => setAckFees(e.target.checked)}
                                className="w-5 h-5 mt-0.5 text-teal rounded border-gray-300 focus:ring-teal shrink-0"
                            />
                            <span className="text-sm text-ink2 font-medium group-hover:text-teal transition-colors">
                                I understand that registration fees are non-refundable.
                            </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={ackNoShow}
                                onChange={(e) => setAckNoShow(e.target.checked)}
                                className="w-5 h-5 mt-0.5 text-teal rounded border-gray-300 focus:ring-teal shrink-0"
                            />
                            <span className="text-sm text-ink2 font-medium group-hover:text-teal transition-colors">
                                I understand that failure to attend without prior notice may affect future participation.
                            </span>
                        </label>
                    </div>

                    {/* Submit Attend */}
                    <div className="flex justify-center">
                        <PixelButton
                            onClick={handleSubmit}
                            variant="primary"
                            size="sm"
                            disabled={!canSubmitAttend || submitting}
                        >
                            {submitting ? "SUBMITTING..." : "CONFIRM ATTENDANCE"}
                        </PixelButton>
                    </div>
                </div>
            )}

            {/* Declining Flow */}
            {attending === false && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="mb-8 p-5 bg-red-50/50 border border-red-200 rounded-2xl space-y-3">
                        <h4 className="font-pixel text-sm text-red-700 mb-2">PLEASE ACKNOWLEDGE</h4>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={ackDecline}
                                onChange={(e) => setAckDecline(e.target.checked)}
                                className="w-5 h-5 mt-0.5 text-red-500 rounded border-gray-300 focus:ring-red-400 shrink-0"
                            />
                            <span className="text-sm text-ink2 font-medium group-hover:text-red transition-colors">
                                I confirm that my team will NOT attend the competition. I understand that our spot will be given to a team on the waiting list and we will not be able to reclaim it later.
                            </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={ackWaitlist}
                                onChange={(e) => setAckWaitlist(e.target.checked)}
                                className="w-5 h-5 mt-0.5 text-red-500 rounded border-gray-300 focus:ring-red-400 shrink-0"
                            />
                            <span className="text-sm text-ink2 font-medium group-hover:text-red transition-colors">
                                I understand that this decision is final and cannot be reversed.
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-center">
                        <PixelButton
                            onClick={handleSubmit}
                            variant="outline-red"
                            size="sm"
                            disabled={!canSubmitDecline || submitting}
                        >
                            {submitting ? "SUBMITTING..." : "CONFIRM: WE WILL NOT ATTEND"}
                        </PixelButton>
                    </div>
                </div>
            )}

            {/* Change of Plans Note */}
            {attending !== null && (
                <div className="mt-8 p-4 bg-yellow-50/50 border border-yellow-200 rounded-xl text-center animate-in fade-in duration-500">
                    <p className="text-xs text-yellow-700 font-bold uppercase tracking-wider mb-1">⚠️ CHANGE OF PLANS?</p>
                    <p className="text-xs text-yellow-600">
                        If anything comes up after confirming attendance, please inform us immediately.
                        All paid registration fees are non-refundable.
                    </p>
                </div>
            )}
        </div>
    );
}
