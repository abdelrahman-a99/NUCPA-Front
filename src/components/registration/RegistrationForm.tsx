import React from "react";
import { MemberDraft } from "@/lib/registration-data";
import PixelButton from "@/components/ui/PixelButton";
import Field from "./Field";
import MemberForm from "./MemberForm";

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
}) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
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
            placeholder="e.g. The Bug Slayers"
          />
        </Field>
      </div>

      <div className="space-y-12">
        <div className="relative p-6 rounded-3xl border border-line/60 bg-white/50">
          <div className="absolute -top-3 left-6 bg-white px-2 font-pixel text-lg text-teal-bright">MEMBER 01</div>
          <MemberForm
            value={members[0]}
            onChange={(next) => setMembers([next, members[1]])}
            errors={{
              name: fieldErrors["member0_name"],
              email: fieldErrors["member0_email"],
              phone_number: fieldErrors["member0_phone_number"],
              nationality: fieldErrors["member0_nationality"],
              university: fieldErrors["member0_university"],
              major: fieldErrors["member0_major"],
              year_of_study: fieldErrors["member0_year_of_study"],
              university_other: fieldErrors["member0_university_other"],
              national_id: fieldErrors["member0_national_id"],
              birth_date: fieldErrors["member0_birth_date"],
              nu_id: fieldErrors["member0_nu_id"],
              codeforces_handle: fieldErrors["member0_codeforces_handle"],
              vjudge_handle: fieldErrors["member0_vjudge_handle"],
              id_document: fieldErrors["member0_id_document"],
              nu_id_document: fieldErrors["member0_nu_id_document"],
            }}
            isEditing={isEditing}
            onBlurField={(sub) => onBlurField(`member0_${sub}`)}
          />
        </div>

        <div className="relative p-6 rounded-3xl border border-line/60 bg-white/50">
          <div className="absolute -top-3 left-6 bg-white px-2 font-pixel text-lg text-teal-bright">MEMBER 02</div>
          <MemberForm
            value={members[1]}
            onChange={(next) => setMembers([members[0], next])}
            errors={{
              name: fieldErrors["member1_name"],
              email: fieldErrors["member1_email"],
              phone_number: fieldErrors["member1_phone_number"],
              nationality: fieldErrors["member1_nationality"],
              university: fieldErrors["member1_university"],
              major: fieldErrors["member1_major"],
              year_of_study: fieldErrors["member1_year_of_study"],
              university_other: fieldErrors["member1_university_other"],
              national_id: fieldErrors["member1_national_id"],
              birth_date: fieldErrors["member1_birth_date"],
              nu_id: fieldErrors["member1_nu_id"],
              codeforces_handle: fieldErrors["member1_codeforces_handle"],
              vjudge_handle: fieldErrors["member1_vjudge_handle"],
              id_document: fieldErrors["member1_id_document"],
              nu_id_document: fieldErrors["member1_nu_id_document"],
            }}
            isEditing={isEditing}
            onBlurField={(sub) => onBlurField(`member1_${sub}`)}
          />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 pt-6 border-t border-line justify-end">
        <PixelButton href="/" variant="outline-red" size="sm">
          DISCARD
        </PixelButton>
        <PixelButton onClick={onSubmit} variant="primary" size="sm">
          {isEditing ? "SAVE CHANGES" : "SUBMIT REGISTRATION"}
        </PixelButton>
      </div>
    </div>
  );
}
