import React from "react";
import { TeamDetails, COUNTRIES } from "@/lib/registration-data";
import PixelButton from "@/components/ui/PixelButton";
import InfoRow from "./InfoRow";
import HandleBadge from "./HandleBadge";

export default function TeamView({
  team,
  onLogout,
  onEdit,
  onDelete
}: {
  team: TeamDetails;
  onLogout: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6 mb-8">
        <div>
          <h2 className="font-pixel text-2xl sm:text-3xl text-ink2 mb-2">TEAM REGISTRATION</h2>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-bright"></span>
            Registration details and current status.
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {(team.application_status === 'PENDING' || team.application_status === 'REJECTED') && (
            <>
              <PixelButton onClick={onEdit} variant="primary" size="sm">
                EDIT REGISTRATION
              </PixelButton>
              <PixelButton onClick={onDelete} variant="outline-red" size="sm">
                WITHDRAW TEAM
              </PixelButton>
            </>
          )}
        </div>
      </div>

      {/* Rejection Alert */}
      {team.application_status === 'REJECTED' && team.rejection_note && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-in slide-in-from-top-4 fade-in duration-500 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-full text-xl">🚨</div>
            <div>
              <h3 className="text-red-800 font-pixel text-lg uppercase mb-1">REGISTRATION RETURNED</h3>
              <p className="text-red-700 text-sm font-bold leading-relaxed mb-2">
                Please review the note below and update the submitted information.
                <span className="block text-[10px] opacity-75 mt-1">Upon resubmission, the registration status will be set to PENDING REVIEW.</span>
              </p>
              <div className="bg-white/50 p-3 rounded-lg border border-red-100/50">
                <p className="text-red-900 font-medium whitespace-pre-wrap text-sm">
                  &quot;{team.rejection_note || "No details provided."}&quot;
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <PixelButton onClick={onEdit} variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 border-red-800 text-white">
              EDIT REGISTRATION
            </PixelButton>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10 bg-bg/50 p-6 rounded-2xl border border-line/50">
        <InfoRow label="Team Name" value={team.team_name} large />

        <InfoRow
          label="Registration Status"
          value={team.application_status || "PENDING"}
          variant={
            team.application_status === 'APPROVED' ? 'success' :
              team.application_status === 'REJECTED' ? 'error' :
                'warning'
          }
        />

        <InfoRow
          label="Online Qualification"
          value={team.online_status === 'ELIGIBLE' ? "ELIGIBLE 🚀" : "Not Eligible"}
          variant={team.online_status === 'ELIGIBLE' ? 'success' : 'info'}
        />

        <InfoRow
          label="Onsite Qualification"
          value={
            team.onsite_status === 'QUALIFIED_PAID' ? "QUALIFIED (PAID) 💰" :
              team.onsite_status === 'QUALIFIED_PENDING' ? "QUALIFIED (PAYMENT PENDING)" :
                "Not Qualified"
          }
          variant={
            team.onsite_status === 'QUALIFIED_PAID' ? 'success' :
              team.onsite_status === 'QUALIFIED_PENDING' ? 'warning' :
                'info'
          }
        />
      </div>

      <div>
        <h3 className="font-pixel text-xl text-ink2 mb-6">TEAM ROSTER</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {team.members.map((m, i) => (
            <div key={m.id} className="group relative rounded-2xl border border-line bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-teal/30">
              <div className="absolute top-4 right-4 text-xs font-bold text-teal/10 group-hover:text-teal/30 pointer-events-none text-4xl font-pixel">
                {i === 0 ? "A" : "B"}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-pixel text-lg sm:text-xl text-ink truncate pr-2 uppercase">{m.name}</p>
                  {m.nu_student && <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[10px] font-bold uppercase tracking-wider border border-teal/20">NU Student</span>}
                </div>
                <p className="text-sm text-muted font-medium">{m.email}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-line/50">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Phone" value={m.phone_number} compact />
                  <InfoRow label="National ID" value={m.national_id} compact />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Nationality" value={COUNTRIES.find(c => c.value === m.nationality)?.label || m.nationality} compact />
                  <InfoRow label="Birth Year" value={String(m.year)} compact />
                </div>
                <div className="grid grid-cols-1 mb-2">
                  <InfoRow label="Date of Birth" value={m.birth_date || "N/A"} compact />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Major" value={m.major || "N/A"} compact />
                  <InfoRow label="Year" value={m.year_of_study || "N/A"} compact />
                </div>
                <div className="flex flex-col gap-1">
                  <InfoRow label="University" value={m.university === "OTHER" ? (m.university_other || "Other") : m.university} compact />
                  {m.nu_student && m.nu_id && <InfoRow label="NU ID" value={m.nu_id} compact />}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-line/30 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">CF Handle</span>
                    <HandleBadge info={m.codeforces_info} type="cf" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">VJ Handle</span>
                    <HandleBadge info={m.vjudge_info} type="vj" />
                  </div>
                </div>

                {m.id_document && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-muted">ID Document</span>
                    <DocumentButton url={m.id_document} label="View ID ↗" />
                  </div>
                )}
                {m.nu_id_document && (
                  <div className="flex justify-between items-center py-1 border-t border-line/30">
                    <span className="text-xs text-muted">NU ID Document</span>
                    <DocumentButton url={m.nu_id_document} label="View NU ID ↗" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentButton({ url, label }: { url: string | null, label: string }) {
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

      // Cleanup
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
      onClick={handleView}
      disabled={loading}
      className="text-xs text-teal hover:underline font-bold flex items-center gap-1 disabled:opacity-50"
    >
      {loading ? "OPENING..." : label}
    </button>
  );
}
