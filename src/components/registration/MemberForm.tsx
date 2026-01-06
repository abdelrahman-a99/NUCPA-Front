import React from "react";
import { MemberDraft, COUNTRIES, UNIVERSITY_CHOICES, YEAR_CHOICES, UniversityChoice } from "@/lib/registration-data";
import Field from "./Field";

export default function MemberForm({
  value,
  onChange,
  errors,
  isEditing,
  onBlurField,
}: {
  value: MemberDraft;
  onChange: (v: MemberDraft) => void;
  errors: Record<string, string | undefined>;
  isEditing?: boolean;
  onBlurField: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <Field label="Full Name" error={errors.name}>
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          onBlur={() => onBlurField("name")}
          className="input-modern"
          placeholder="e.g. Omar Ahmed"
        />
      </Field>

      <Field label="Email Address" error={errors.email}>
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          onBlur={() => onBlurField("email")}
          className="input-modern"
          placeholder="email@gmail.com"
          type="email"
        />
      </Field>

      <Field label="Phone number" error={errors.phone_number}>
        <div className="flex gap-2">
          <select
            className="w-24 input-modern bg-transparent px-2"
            value={value.phone_number.split(' ')[0].startsWith('+') ? value.phone_number.split(' ')[0] : "+20"}
            onChange={(e) => {
              const code = e.target.value;
              const rest = value.phone_number.split(' ').slice(1).join(' ');
              onChange({ ...value, phone_number: `${code} ${rest}`.trim() });
            }}
          >
            <option value="+20">+20 (EG)</option>
            <option value="+966">+966 (SA)</option>
            <option value="+971">+971 (AE)</option>
            <option value="+965">+965 (KW)</option>
            <option value="+974">+974 (QA)</option>
            <option value="+973">+973 (BH)</option>
            <option value="+962">+962 (JO)</option>
            <option value="+961">+961 (LB)</option>
            <option value="+963">+963 (SY)</option>
            <option value="+964">+964 (IQ)</option>
            <option value="+212">+212 (MA)</option>
            <option value="+213">+213 (DZ)</option>
            <option value="+216">+216 (TN)</option>
            <option value="+218">+218 (LY)</option>
            <option value="+249">+249 (SD)</option>
            <option value="+967">+967 (YE)</option>
            <option value="+968">+968 (OM)</option>
            <option value="+1">+1 (US/CA)</option>
            <option value="+44">+44 (UK)</option>
          </select>
          <input
            value={value.phone_number.includes(' ') ? value.phone_number.split(' ').slice(1).join(' ') : value.phone_number}
            onChange={(e) => {
              const code = value.phone_number.split(' ')[0].startsWith('+') ? value.phone_number.split(' ')[0] : "+20";
              onChange({ ...value, phone_number: `${code} ${e.target.value.replace(/\D/g, '')}` });
            }}
            onBlur={() => onBlurField("phone_number")}
            className="flex-grow input-modern"
            placeholder="01xx xxx xxxx"
          />
        </div>
      </Field>

      <Field label="Codeforces Handle (Optional)" error={errors.codeforces_handle}>
        <input
          value={value.codeforces_handle}
          onChange={(e) => onChange({ ...value, codeforces_handle: e.target.value })}
          onBlur={() => onBlurField("codeforces_handle")}
          className="input-modern"
          placeholder="e.g. tourist"
        />
      </Field>

      <Field label="Vjudge Handle (Optional)" error={errors.vjudge_handle}>
        <input
          value={value.vjudge_handle}
          onChange={(e) => onChange({ ...value, vjudge_handle: e.target.value })}
          onBlur={() => onBlurField("vjudge_handle")}
          className="input-modern"
          placeholder="e.g. vjudge_user"
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
          onChange={(e) => onChange({ ...value, university: e.target.value })}
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
        <input
          value={value.major}
          onChange={(e) => onChange({ ...value, major: e.target.value })}
          onBlur={() => onBlurField("major")}
          className="input-modern"
          placeholder="e.g. Computer Science"
        />
      </Field>

      <Field label="Year of Study" error={errors.year_of_study}>
        <select
          value={value.year_of_study}
          onChange={(e) => onChange({ ...value, year_of_study: e.target.value })}
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
          max="2009-12-31"
        />
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
                <a
                  href={value.existing_nu_id_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal hover:underline font-bold"
                >
                  View existing NU ID ↗
                </a>
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
            <a
              href={value.existing_id_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal hover:underline font-bold"
            >
              View existing document ↗
            </a>
          </div>
        ) : null}
      </Field>
    </div>
  );
}
