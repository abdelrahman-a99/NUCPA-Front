import React from "react";
import { MemberDraft } from "@/lib/registration-data";
import PixelButton from "@/components/ui/PixelButton";
import Field from "./Field";
import MemberForm from "./MemberForm";
import RulesModal from "./RulesModal";

export default function RegistrationForm({
  isEditing = false,
  teamName,
  setTeamName,
  members,
  setMembers,
  fieldErrors,
  onSubmit,
  onLogout,
  onCancel,
  onBlurField,
  rulesAccepted,
  setRulesAccepted,
  dataSharingConsent,
  setDataSharingConsent
}: {
  isEditing?: boolean;
  teamName: string;
  setTeamName: (v: string) => void;
  members: MemberDraft[];
  setMembers: (v: MemberDraft[]) => void;
  fieldErrors: Record<string, string>;
  onSubmit: () => void;
  onLogout: () => void;
  onCancel?: () => void;
  onBlurField: (name: string) => void;
  rulesAccepted: boolean;
  setRulesAccepted: (v: boolean) => void;
  dataSharingConsent: boolean;
  setDataSharingConsent: (v: boolean) => void;
}) {
  const [isRulesModalOpen, setIsRulesModalOpen] = React.useState(false);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onAccept={(rules: boolean, dataSharing: boolean) => {
          setRulesAccepted(rules);
          setDataSharingConsent(dataSharing);
          setIsRulesModalOpen(false);
        }}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6 mb-8">
        <div>
          <h2 className="font-pixel text-3xl text-ink2 mb-2">
            {isEditing ? "EDIT TEAM" : "REGISTER TEAM"}
          </h2>
          <p className="text-sm text-muted">
            {isEditing
              ? "Update your team details below."
              : "Complete the roster. A team must have exactly 2 members."}
          </p>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <PixelButton onClick={onCancel} variant="ghost" size="sm">
              CANCEL
            </PixelButton>
          )}
        </div>
      </div>

      <div className="mb-10 max-w-lg">
        <Field label="Team Name" error={fieldErrors["team_name"]}>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onBlur={() => onBlurField("team_name")}
            className="w-full h-12 rounded-xl border border-line bg-bg/50 px-4 transition-all focus:border-teal focus:ring-2 focus:ring-teal/20 focus:bg-white outline-none font-pixel text-sm"
            placeholder="e.g. 4aklna 8er2na ya 3mo samy"
          />
        </Field>
      </div>

      <div className="space-y-12">
        {[0, 1].map((i) => (
          <div key={i} className="relative p-6 rounded-3xl border border-line/60 bg-white/50">
            <div className="absolute -top-3 left-6 bg-white px-2 font-pixel text-lg text-teal-bright">
              MEMBER 0{i + 1}
            </div>
            <MemberForm
              index={i}
              value={members[i]}
              onChange={(next) => {
                const newMembers = [...members];
                newMembers[i] = next;
                setMembers(newMembers);
              }}
              errors={Object.keys(fieldErrors)
                .filter((k) => k.startsWith(`member${i}_`))
                .reduce((acc, k) => ({ ...acc, [k.replace(`member${i}_`, "")]: fieldErrors[k] }), {})}
              isEditing={isEditing}
              onBlurField={(sub) => onBlurField(`member${i}_${sub}`)}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col md:flex-row gap-8 pt-6 border-t border-line justify-between items-center bg-teal-50/50 p-6 rounded-2xl border-2 border-teal/10">

        <div className="flex-1">
          <h4 className="font-pixel text-teal-dark mb-2">COMPETITION RULES</h4>
          <p className="text-sm text-muted mb-4">
            You must review and accept the competition rules and format before submitting your team.
          </p>

          <button
            type="button"
            onClick={() => setIsRulesModalOpen(true)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-dashed border-2 w-full md:w-auto transition-all ${rulesAccepted ? 'border-teal bg-teal/5 text-teal-dark' : 'border-red-300 bg-red-50 text-red-500 hover:border-red-400'}`}
          >
            <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${rulesAccepted ? 'bg-teal border-teal' : 'border-current'}`}>
              {rulesAccepted && <span className="text-white text-sm font-bold">✓</span>}
            </div>
            <span className="font-pixel text-sm uppercase">
              {rulesAccepted ? "RULES & CONSENT ACCEPTED" : "REVIEW RULES & CONSENT (REQUIRED)"}
            </span>
          </button>
        </div>

        <div className="flex gap-4">
          <PixelButton href="/" variant="outline-red" size="sm">
            DISCARD
          </PixelButton>
          <PixelButton
            onClick={onSubmit}
            variant="primary"
            size="sm"
            disabled={!rulesAccepted}
            className={!rulesAccepted ? "opacity-50 cursor-not-allowed grayscale" : ""}
          >
            {isEditing ? "SAVE CHANGES" : "SUBMIT REGISTRATION"}
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
