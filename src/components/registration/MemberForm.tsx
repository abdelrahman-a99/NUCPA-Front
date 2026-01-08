import React from "react";
import { MemberDraft, COUNTRIES, UNIVERSITY_CHOICES, YEAR_CHOICES, MAJOR_CHOICES, UniversityChoice } from "@/lib/registration-data";
import { PHONE_CODES } from "@/lib/phone-data";
import Field from "./Field";
import DocumentButton from "@/components/ui/DocumentButton";

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
      <Field label="Full Name" error={errors.name}>
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          onBlur={() => onBlurField("name")}
          className="input-modern"
          placeholder={index === 1 ? "e.g. Omar Ayman Morshedy" : "e.g. Adham Ahmed Hammoda"}
        />
      </Field>

      <Field label="Email Address" error={errors.email}>
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          onBlur={() => onBlurField("email")}
          className="input-modern"
          placeholder={index === 1 ? "ahmed@example.com" : "sara@university.edu"}
          type="email"
        />
      </Field>

      <Field label="Phone number" error={errors.phone_number}>
        {/* Helper to parse phone number */}
        {(() => {
          const raw = value.phone_number.trim();

          // Use pre-sorted codes for better performance
          const sortedCodes = SORTED_PHONE_CODES;

          let codeObj = sortedCodes.find(c => c.code === "+20"); // Default to Egypt
          let local = "";

          // Try to find a matching prefix
          const matched = sortedCodes.find(c => raw.startsWith(c.code));
          if (matched) {
            codeObj = matched;
            local = raw.slice(matched.code.length).trim();
          } else if (raw.startsWith("+")) {
            // Fallback: try to match just by code string if exact match fails
            // (Though the list covers most, manual + entry might happen)
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

      <Field label="Codeforces Handle (Optional)" error={errors.codeforces_handle}>
        <input
          value={value.codeforces_handle}
          onChange={(e) => onChange({ ...value, codeforces_handle: e.target.value })}
          onBlur={() => onBlurField("codeforces_handle")}
          className="input-modern"
          placeholder={index === 1 ? "e.g. Morshedy_22" : "e.g. Adhoom"}
        />
      </Field>

      <Field label="Vjudge Handle (Optional)" error={errors.vjudge_handle}>
        <input
          value={value.vjudge_handle}
          onChange={(e) => onChange({ ...value, vjudge_handle: e.target.value })}
          onBlur={() => onBlurField("vjudge_handle")}
          className="input-modern"
          placeholder={index === 1 ? "e.g. Morshdy22" : "e.g. Adhoom"}
        />
      </Field>

      <Field label="Nationality" error={errors.nationality}>
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
            // Auto-sync TEENS: if university becomes TEENS, set year_of_study to TEENS
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

      <Field label="Major" error={errors.major}>
        {/* Show dropdown for predefined majors, or text input if 'OTHER' selected */}
        {value.major === "OTHER" ? (
          <input
            value={value.major}
            onChange={(e) => onChange({ ...value, major: e.target.value })}
            onBlur={() => onBlurField("major")}
            className="input-modern"
            placeholder="Specify your major"
          />
        ) : (
          <select
            value={MAJOR_CHOICES.find(m => m.value === value.major || m.label === value.major)?.value || value.major}
            onChange={(e) => {
              const selected = e.target.value;
              // If OTHER, we store 'OTHER' and user might type custom
              // Otherwise store the label for readability
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

      <Field label="Year of Study" error={errors.year_of_study}>
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
              // If leaving TEENS year, reset university
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
        <Field label="University Name" error={errors.university_other}>
          <input
            value={value.university_other}
            onChange={(e) => onChange({ ...value, university_other: e.target.value })}
            onBlur={() => onBlurField("university_other")}
            className="input-modern"
            placeholder="Official university name"
          />
        </Field>
      )}

      <Field label={value.nationality === "EG" ? "National ID" : "Passport ID"} error={errors.national_id}>
        <input
          value={value.national_id}
          onChange={(e) => onChange({ ...value, national_id: e.target.value })}
          onBlur={() => onBlurField("national_id")}
          className="input-modern"
          placeholder={value.nationality === "EG" ? "299xxxxxxxxxxx" : "Passport number"}
        />
      </Field>

      <Field label="Date of Birth" error={errors.birth_date}>
        <input
          type="date"
          value={value.birth_date}
          onChange={(e) => onChange({ ...value, birth_date: e.target.value })}
          onBlur={() => onBlurField("birth_date")}
          className="input-modern cursor-text"
          min="1999-01-01"
          max="2011-12-31"
        />
        <p className="mt-1 text-[10px] text-muted font-medium italic">
          Must be born between 1999 and 2011 (Ages 14-26)
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
              placeholder="e.g. 22100xxxx"
            />
          </Field>

          <Field label="NU ID Document" error={errors.nu_id_document}>
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
                <DocumentButton url={value.existing_nu_id_url} label="View existing NU ID ↗" />
              </div>
            ) : null}
          </Field>
        </>
      )}

      <Field label="ID Document" error={errors.id_document}>
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
            <DocumentButton url={value.existing_id_url} label="View existing document ↗" />
          </div>
        ) : null}
      </Field>
    </div>
  );
}


