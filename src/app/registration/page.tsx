"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PixelButton from "@/components/ui/PixelButton";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

type UniversityChoice = { value: string; label: string };

// Keep this list aligned with backend Member.UNIVERSITY_CHOICES.
const UNIVERSITY_CHOICES: UniversityChoice[] = [
  { value: "TEENS", label: "Teens / High School" },
  { value: "AIN_SHAMS", label: "Ain Shams University" },
  { value: "AKHBAR_EL_YOM_ACADEMY", label: "Akhbar El Yom Academy" },
  { value: "AL_AZHAR_UNIVERSITY", label: "Al Azhar University" },
  { value: "ALEX", label: "Alexandria University" },
  { value: "AMERICAN_UNIVERSITY_IN_CAIRO", label: "American University in Cairo" },
  { value: "ARAB_ACADEMY_FOR_SCIENCE_AND_TECHNOLOGY", label: "Arab Academy for Science & Technology" },
  { value: "ARAB_OPEN_UNIVERSITY", label: "Arab Open University" },
  { value: "ASSIUT_UNIVERSITY", label: "Assiut University" },
  { value: "BADR_UNIVERSITY_IN_CAIRO", label: "Badr University in Cairo" },
  { value: "BENHA_UNIVERSITY", label: "Benha University" },
  { value: "BENI_SUEF", label: "Beni Suef University" },
  { value: "CIC___CANADIAN_INTERNATIONAL_COLLEGE", label: "CIC - Canadian International College" },
  { value: "CAIRO", label: "Cairo University" },
  { value: "DAMANHOUR_UNIVERSITY", label: "Damanhour University" },
  { value: "DAMIETTA", label: "Damietta University" },
  { value: "DERAYA_UNIVERSITY", label: "Deraya University" },
  { value: "EL_SHOROUK_ACADEMY", label: "El Shorouk Academy" },
  { value: "FAYOUM_UNIVERSITY", label: "Fayoum University" },
  { value: "FUTURE_UNIVERSITY", label: "Future University" },
  { value: "GERMAN_UNIVERSITY_IN_CAIRO", label: "German University in Cairo" },
  { value: "HELWAN", label: "Helwan University" },
  { value: "HIGHER_TECHNOLOGICAL_INSTITUTE", label: "Higher Technological Institute" },
  { value: "KAFR_EL_SHEIKH_UNIVERSITY", label: "Kafr El-Sheikh University" },
  { value: "MANSOURA", label: "Mansoura University" },
  { value: "MENOUFIA_UNIVERSITY", label: "Menoufia University" },
  { value: "MILITARY_TECHNICAL_COLLEGE", label: "Military Technical College" },
  { value: "MINIA", label: "Minia University" },
  { value: "MISR_INTERNATIONAL_UNIVERSITY", label: "Misr International University" },
  { value: "MISR_UNIVERSITY_FOR_SIENCE_AND_TECHNOLOGY", label: "Misr University for Sience and Technology" },
  { value: "MODERN_ACADMY", label: "Modern Acadmy" },
  { value: "MODERN_SCIENCES_AND_ARTS_UNIVERSITY", label: "Modern Sciences & Arts University" },
  { value: "MODERN_UNIVERSITY_FOR_TECHNOLOGY_AND_INFORMATION", label: "Modern University For Technology and Information" },
  { value: "NU", label: "Nile University" },
  { value: "OCTOBER_6_UNIVERSITY", label: "October 6 university" },
  { value: "PHAROS_INTERNATIONAL_UNIVERSITY", label: "Pharos International University" },
  { value: "SADAT_ACADEMY_FOR_MANAGEMENT_SCIENCES", label: "Sadat Academy for Management Sciences" },
  { value: "SINAI_UNIVERSITY", label: "Sinai University" },
  { value: "SOHAG", label: "Sohag University" },
  { value: "SOUTH_VALLEY", label: "South Valley University" },
  { value: "SUEZ_CANAL", label: "Suez Canal University" },
  { value: "TANTA", label: "Tanta University" },
  { value: "UNIVERSITÉ_FRANÇAISE_DÉGYPTE", label: "Université Française d'Égypte" },
  { value: "UNIVERSITÉ_SENGHOR_DALEXANDRIE", label: "Université Senghor d'Alexandrie" },
  { value: "ZAGAZIG", label: "Zagazig University" },
  { value: "OTHER", label: "Other (University not listed)" },
];

type MemberDraft = {
  name: string;
  nationality: string; // Country code (EG, SA, US, ...)
  email: string;
  phone_number: string;
  university: string;
  national_id: string;
  birth_year: string;
  id_document: File | null;
};

type TeamDetails = {
  id: number;
  team_name: string;
  payment_status: boolean;
  checked_in: boolean;
  created_at: string;
  members: Array<{
    id: number;
    name: string;
    nationality: string;
    email: string;
    phone_number: string;
    university: string;
    national_id: string;
    birth_year: number;
    nu_student: boolean;
    id_document?: string;
  }>;
};



export default function RegistrationPage() {
  const params = useSearchParams();

  const [phase, setPhase] = useState<
    "idle" | "checking" | "hasTeam" | "noTeam" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);

  const [teamName, setTeamName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [members, setMembers] = useState<MemberDraft[]>(() => [
    {
      name: "",
      nationality: "EG",
      email: "",
      phone_number: "",
      university: "NU",
      national_id: "",
      birth_year: "",
      id_document: null,
    },
    {
      name: "",
      nationality: "EG",
      email: "",
      phone_number: "",
      university: "NU",
      national_id: "",
      birth_year: "",
      id_document: null,
    },
  ]);

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const handleSuccess = useMemo(() => () => checkTeam(), []);

  const { login: startGoogleLogin, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin({
    onSuccess: handleSuccess,
  });

  async function checkTeam() {
    setError(null);
    setPhase("checking");
    try {
      const res = await fetch("/api/registration/teams", { method: "GET" });
      if (res.status === 401) {
        setPhase("idle");
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to check team (${res.status})`);
      }
      const list = (await res.json()) as Array<{ id: number }>;
      if (list.length > 0) {
        const id = list[0].id;
        const res2 = await fetch(`/api/registration/teams/${id}`, { method: "GET" });
        if (!res2.ok) {
          const text = await res2.text();
          throw new Error(text || `Failed to load team (${res2.status})`);
        }
        const details = (await res2.json()) as TeamDetails;
        setTeam(details);
        setPhase("hasTeam");
      } else {
        setPhase("noTeam");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
      setPhase("error");
    }
  }



  useEffect(() => {
    // On first visit, attempt to check team (might succeed if cookies already exist).
    checkTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function submitRegistration() {
    setError(null);

    // Minimal client-side validation (backend is source of truth).
    if (!teamName.trim()) return setError("Team name is required.");
    if (!members[0].name.trim() || !members[1].name.trim()) return setError("Both member names are required.");
    if (!members[0].national_id.trim() || !members[1].national_id.trim()) return setError("Both National IDs are required.");
    if (members[0].national_id.trim() === members[1].national_id.trim()) return setError("Members must have different National IDs.");
    if (!members[0].id_document || !members[1].id_document) return setError("Both ID documents are required.");

    setPhase("checking");

    try {
      const fd = new FormData();
      fd.append("team_name", teamName.trim());
      fd.append("payment_status", String(paymentStatus));

      // Backend expects `members` as a JSON string.
      const membersJson = members.map((m) => ({
        name: m.name.trim(),
        nationality: m.nationality.trim() || "EG",
        email: m.email.trim(),
        phone_number: m.phone_number.trim(),
        university: m.university,
        national_id: m.national_id.trim(),
        birth_year: Number(m.birth_year),
        // nu_student is set automatically by backend when university === "NU"
      }));

      fd.append("members", JSON.stringify(membersJson));

      // Backend expects files under keys like: members[0][id_document]
      fd.append("members[0][id_document]", members[0].id_document as File);
      fd.append("members[1][id_document]", members[1].id_document as File);

      const res = await fetch("/api/registration/teams", { method: "POST", body: fd });
      if (res.status === 401) {
        setPhase("idle");
        setError("Your session expired. Please login again.");
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Registration failed (${res.status})`);
      }
      await checkTeam();
    } catch (e: any) {
      setError(e?.message || "Registration failed.");
      setPhase("error");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setTeam(null);
    setPhase("idle");
    setError(null);
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="container-max py-10">
        <h1 className="font-pixel text-3xl sm:text-5xl text-teal-bright pixel-outline">REGISTRATION</h1>

        <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl">
          Flow: Google Login → If you already registered, you’ll see your team. Otherwise, you’ll fill the registration form.
        </p>

        {(error || googleError) && (
          <div className="mt-6 rounded-2xl border border-red/40 bg-white p-4 text-sm text-red">
            {error || googleError}
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-soft">
          {(phase === "idle") && (
            <div className="flex flex-col gap-4">
              <p className="text-ink">
                To continue, login with Google.
              </p>
              <div className="flex flex-wrap gap-3">
                <PixelButton onClick={startGoogleLogin} variant="primary">
                  {isGoogleLoading ? "OPENING GOOGLE..." : "LOGIN WITH GOOGLE"}
                </PixelButton>
                <PixelButton href="/" variant="ghost">
                  BACK TO HOME
                </PixelButton>
              </div>
            </div>
          )}

          {phase === "checking" && (
            <p className="text-ink font-semibold">Loading…</p>
          )}

          {phase === "hasTeam" && team && (
            <TeamView team={team} onLogout={logout} />
          )}

          {phase === "noTeam" && (
            <RegistrationForm
              teamName={teamName}
              setTeamName={setTeamName}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              members={members}
              setMembers={setMembers}
              onSubmit={submitRegistration}
              onLogout={logout}
            />
          )}

          {phase === "error" && (
            <div className="flex flex-wrap gap-3">
              <PixelButton onClick={checkTeam} variant="primary">
                RETRY
              </PixelButton>
              <PixelButton onClick={logout} variant="ghost">
                LOGOUT
              </PixelButton>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TeamView({ team, onLogout }: { team: TeamDetails; onLogout: () => void }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-pixel text-2xl text-ink2">YOUR TEAM</h2>
          <p className="mt-1 text-sm text-muted">
            If you need changes, contact NUCPA organizers.
          </p>
        </div>
        <PixelButton onClick={onLogout} variant="ghost">
          LOGOUT
        </PixelButton>
      </div>

      <div className="mt-6 grid gap-4">
        <InfoRow label="Team name" value={team.team_name} />
        <InfoRow label="Payment status" value={team.payment_status ? "Paid" : "Not paid"} />
        <InfoRow label="Checked in" value={team.checked_in ? "Yes" : "No"} />
      </div>

      <div className="mt-8">
        <h3 className="font-pixel text-xl text-ink2">MEMBERS</h3>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {team.members.map((m) => (
            <div key={m.id} className="rounded-2xl border border-line p-4">
              <p className="font-bold text-ink">{m.name}</p>
              <p className="text-sm text-muted mt-1">{m.email}</p>
              <div className="mt-3 text-sm">
                <InfoRow label="National ID" value={m.national_id} compact />
                <InfoRow label="University" value={m.university} compact />
                <InfoRow label="Birth year" value={String(m.birth_year)} compact />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegistrationForm({
  teamName,
  setTeamName,
  paymentStatus,
  setPaymentStatus,
  members,
  setMembers,
  onSubmit,
  onLogout,
}: {
  teamName: string;
  setTeamName: (v: string) => void;
  paymentStatus: boolean;
  setPaymentStatus: (v: boolean) => void;
  members: MemberDraft[];
  setMembers: (v: MemberDraft[]) => void;
  onSubmit: () => void;
  onLogout: () => void;
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-pixel text-2xl text-ink2">REGISTER YOUR TEAM</h2>
          <p className="mt-1 text-sm text-muted">
            Fill the form. Team must have exactly 2 members.
          </p>
        </div>
        <PixelButton onClick={onLogout} variant="ghost">
          LOGOUT
        </PixelButton>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">Team name</span>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="h-11 rounded-xl border border-line px-3"
            placeholder="e.g. Byte Busters"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.checked)}
          />
          <span className="text-sm text-ink">Payment completed</span>
        </label>
      </div>

      <div className="mt-8">
        <h3 className="font-pixel text-xl text-ink2">MEMBER 1</h3>
        <MemberForm
          value={members[0]}
          onChange={(next) => setMembers([next, members[1]])}
        />
      </div>

      <div className="mt-8">
        <h3 className="font-pixel text-xl text-ink2">MEMBER 2</h3>
        <MemberForm
          value={members[1]}
          onChange={(next) => setMembers([members[0], next])}
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <PixelButton onClick={onSubmit} variant="primary">
          SUBMIT REGISTRATION
        </PixelButton>
        <PixelButton href="/" variant="ghost">
          BACK TO HOME
        </PixelButton>
      </div>
    </div>
  );
}

function MemberForm({ value, onChange }: { value: MemberDraft; onChange: (v: MemberDraft) => void }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Full name">
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="h-11 rounded-xl border border-line px-3"
          placeholder="Student name"
        />
      </Field>

      <Field label="Email">
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="h-11 rounded-xl border border-line px-3"
          placeholder="name@email.com"
        />
      </Field>

      <Field label="Phone number">
        <input
          value={value.phone_number}
          onChange={(e) => onChange({ ...value, phone_number: e.target.value })}
          className="h-11 rounded-xl border border-line px-3"
          placeholder="+20…"
        />
      </Field>

      <Field label="Nationality (country code)">
        <input
          value={value.nationality}
          onChange={(e) => onChange({ ...value, nationality: e.target.value.toUpperCase() })}
          className="h-11 rounded-xl border border-line px-3"
          placeholder="EG"
        />
      </Field>

      <Field label="University">
        <select
          value={value.university}
          onChange={(e) => onChange({ ...value, university: e.target.value })}
          className="h-11 rounded-xl border border-line px-3 bg-white"
        >
          {UNIVERSITY_CHOICES.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="National ID / Passport">
        <input
          value={value.national_id}
          onChange={(e) => onChange({ ...value, national_id: e.target.value })}
          className="h-11 rounded-xl border border-line px-3"
          placeholder="Unique ID"
        />
      </Field>

      <Field label="Birth year (1999–2009)">
        <input
          value={value.birth_year}
          onChange={(e) => onChange({ ...value, birth_year: e.target.value })}
          className="h-11 rounded-xl border border-line px-3"
          placeholder="2004"
          inputMode="numeric"
        />
      </Field>

      <Field label="ID document upload">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onChange({ ...value, id_document: e.target.files?.[0] || null })}
          className="h-11 rounded-xl border border-line px-3 py-2"
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "flex justify-between gap-3" : "grid grid-cols-1 sm:grid-cols-3 gap-2"}>
      <span className="text-sm text-muted">{label}</span>
      <span className={compact ? "text-sm text-ink" : "sm:col-span-2 text-sm text-ink font-semibold"}>
        {value}
      </span>
    </div>
  );
}
