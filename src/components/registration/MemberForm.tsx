import React from "react";
import { MemberDraft, COUNTRIES, UNIVERSITY_CHOICES, YEAR_CHOICES, MAJOR_CHOICES, UniversityChoice } from "@/lib/registration-data";
import { PHONE_CODES } from "@/lib/phone-data";
import Field from "./Field";

const SORTED_PHONE_CODES = [...PHONE_CODES].sort((a, b) => b.code.length - a.code.length);

export default function MemberForm({
  value,
  onChange,
  errors,
  isEditing,
  onBlurField,
  index = 0,
}: {
  value: MemberDraft;
  onChange: (v: MemberDraft) => void;
  errors: Record<string, string | undefined>;
  isEditing?: boolean;
  onBlurField: (name: string) => void;
  index?: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <Field label="Contestant Name" error={errors.name}>
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          onBlur={() => onBlurField("name")}
          className="input-modern"
          placeholder={index === 1 ? "Omar Ayman Morshedy" : "Adham Ahmed Hammoda"}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          onBlur={() => onBlurField("email")}
          className="input-modern"
          placeholder={index === 1 ? "Morshedy@example.com" : "Hammoda@example.com"}
          type="email"
        />
      </Field>

      <Field label="Phone" error={errors.phone_number}>
        {/* Helper to parse phone number */}
        {(() => {
          const raw = value.phone_number.trim();

          const sortedCodes = SORTED_PHONE_CODES;
          let codeObj = sortedCodes.find(c => c.code === "+20"); // Default to Egypt
          let local = "";

          const matched = sortedCodes.find(c => raw.startsWith(c.code));
          if (matched) {
            codeObj = matched;
            local = raw.slice(matched.code.length).trim();
          } else if (raw.startsWith("+")) {
          } else if (raw) {
            local = raw;
          }

          const currentCode = codeObj ? codeObj.code : "+20";
          const currentMask = codeObj ? codeObj.mask : "xxxxxxxxx";

          return (
            <div className="flex gap-2">
              <select
                className="w-32 input-modern bg-transparent px-2"
                value={currentCode}
                onChange={(e) => {
                  const newCode = e.target.value;
                  // Keep local part
                  onChange({ ...value, phone_number: `${newCode}${local}` });
                }}
              >
                {PHONE_CODES.map((c) => (
                  <option key={c.country} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                value={local}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  const numericCode = currentCode.replace('+', '');
                  if (val.startsWith(numericCode)) {
                    val = val.slice(numericCode.length);
                  }
                  onChange({ ...value, phone_number: `${currentCode}${val}` });
                }}
                onBlur={() => onBlurField("phone_number")}
                className="flex-grow input-modern"
                placeholder={currentMask}
              />
            </div>
          );
        })()}
      </Field>

      <Field label="CF Handle (Optional)" error={errors.codeforces_handle}>
        <input
          value={value.codeforces_handle}
          onChange={(e) => onChange({ ...value, codeforces_handle: e.target.value })}
          onBlur={() => onBlurField("codeforces_handle")}
          className="input-modern"
          placeholder={index === 1 ? "Morshedy_22" : "Adhoom"}
        />
      </Field>

      <Field label="VJudge Handle (Optional)" error={errors.vjudge_handle}>
        <input
          value={value.vjudge_handle}
          onChange={(e) => onChange({ ...value, vjudge_handle: e.target.value })}
          onBlur={() => onBlurField("vjudge_handle")}
          className="input-modern"
          placeholder={index === 1 ? "Morshdy22" : "Adhoom"}
        />
      </Field>

      <Field label="Country" error={errors.nationality}>
        <select
          value={value.nationality}
          onChange={(e) => onChange({ ...value, nationality: e.target.value })}
          onBlur={() => onBlurField("nationality")}
          className="input-modern bg-transparent"
        >
          {COUNTRIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="University" error={errors.university}>
        <select
          value={value.university}
          onChange={(e) => {
            const nextUni = e.target.value as UniversityChoice["value"];
            const updates: Partial<MemberDraft> = { university: nextUni };
            if (nextUni !== "NU") {
              updates.nu_id = "";
              updates.nu_id_document = null;
            }
            if (nextUni !== "OTHER") {
              updates.university_other = "";
            }
            if (nextUni === "TEENS") {
              updates.year_of_study = "TEENS";
            } else if (value.year_of_study === "TEENS") {
              // If leaving TEENS university, reset year
              updates.year_of_study = "FRESHMAN";
            }
            onChange({ ...value, ...updates });
          }}
          onBlur={() => onBlurField("university")}
          className="input-modern bg-transparent"
        >
          {UNIVERSITY_CHOICES.map((u: UniversityChoice) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Major / Track" error={errors.major}>
        {/* Show dropdown for predefined majors, or text input if 'OTHER' selected */}
        {value.major === "OTHER" ? (
          <input
            value={value.major}
            onChange={(e) => onChange({ ...value, major: e.target.value })}
            onBlur={() => onBlurField("major")}
            className="input-modern"
            placeholder="CS, CE, AI"
          />
        ) : (
          <select
            value={MAJOR_CHOICES.find(m => m.value === value.major || m.label === value.major)?.value || value.major}
            onChange={(e) => {
              const selected = e.target.value;
              const choice = MAJOR_CHOICES.find(m => m.value === selected);
              onChange({ ...value, major: choice?.label || selected });
            }}
            onBlur={() => onBlurField("major")}
            className="input-modern bg-transparent"
          >
            {MAJOR_CHOICES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field label="Academic Year" error={errors.year_of_study}>
        <select
          value={value.year_of_study}
          onChange={(e) => {
            const nextYear = e.target.value;
            const updates: Partial<MemberDraft> = { year_of_study: nextYear };
            // Auto-sync TEENS: if year becomes TEENS, set university to TEENS
            if (nextYear === "TEENS") {
              updates.university = "TEENS";
              updates.nu_id = "";
              updates.nu_id_document = null;
              updates.university_other = "";
            } else if (value.university === "TEENS") {
              updates.university = "NU";
            }
            onChange({ ...value, ...updates });
          }}
          onBlur={() => onBlurField("year_of_study")}
          className="input-modern bg-transparent"
        >
          {YEAR_CHOICES.map((y: { value: string; label: string }) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </Field>

      {value.university === "OTHER" && (
        <Field label="Institution Name" error={errors.university_other}>
          <input
            value={value.university_other}
            onChange={(e) => onChange({ ...value, university_other: e.target.value })}
            onBlur={() => onBlurField("university_other")}
            className="input-modern"
            placeholder="Official university name"
          />
        </Field>
      )}

      <Field label={value.nationality === "EG" ? "National ID" : "Passport No."} error={errors.national_id}>
        <input
          value={value.national_id}
          onChange={(e) => onChange({ ...value, national_id: e.target.value })}
          onBlur={() => onBlurField("national_id")}
          className="input-modern"
          placeholder={value.nationality === "EG" ? "299xxxxxxxxxxx" : "A12345678"}
        />
      </Field>

      <Field label="Birth Date" error={errors.birth_date}>
        <input
          type="date"
          value={value.birth_date}
          onChange={(e) => onChange({ ...value, birth_date: e.target.value })}
          onBlur={() => onBlurField("birth_date")}
          className="input-modern cursor-text"
          min="2001-02-01"
          max="2014-02-01"
        />
        <p className="mt-1 text-[10px] text-muted font-medium italic">
          Age range: 12–25 (Born Feb 2001 – Feb 2014)
        </p>
      </Field>

      {value.university === "NU" && (
        <>
          <Field label="NU Student ID" error={errors.nu_id}>
            <input
              value={value.nu_id}
              onChange={(e) => onChange({ ...value, nu_id: e.target.value.replace(/\D/g, '') })}
              onBlur={() => onBlurField("nu_id")}
              className="input-modern"
              placeholder="22100xxxx"
            />
          </Field>

          <Field label="NU ID Proof" error={errors.nu_id_document}>
            <div className="relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => onChange({ ...value, nu_id_document: e.target.files?.[0] || null })}
                onBlur={() => onBlurField("nu_id_document")}
                className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-bright/10 file:text-teal-bright hover:file:bg-teal-bright/20 cursor-pointer"
              />
            </div>
            {value.nu_id_document ? (
              <p className="mt-1 text-xs text-teal">Attached: {value.nu_id_document.name}</p>
            ) : isEditing && value.existing_nu_id_url ? (
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-muted">Currently:</p>
                <DocumentButton url={value.existing_nu_id_url} label="View ↗" />
              </div>
            ) : null}
          </Field>
        </>
      )}

      <Field label="National ID Proof" error={errors.id_document}>
        <div className="relative">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => onChange({ ...value, id_document: e.target.files?.[0] || null })}
            onBlur={() => onBlurField("id_document")}
            className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-bright/10 file:text-teal-bright hover:file:bg-teal-bright/20 cursor-pointer"
          />
        </div>
        {value.id_document ? (
          <p className="mt-1 text-xs text-teal">Attached: {value.id_document.name}</p>
        ) : isEditing && value.existing_id_url ? (
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs text-muted">Currently:</p>
            <DocumentButton url={value.existing_id_url} label="View ↗" />
          </div>
        ) : null}
      </Field>
    </div>
  );
}

function DocumentButton({ url, label }: { url: string | null | undefined, label: string }) {
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
      className="text-xs text-teal hover:underline font-bold disabled:opacity-50"
    >
      {loading ? "LOADING..." : label}
    </button>
  );
}
