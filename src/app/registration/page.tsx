"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [phase, setPhase] = useState<
    "idle" | "checking" | "hasTeam" | "noTeam" | "editing" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);

  const [teamName, setTeamName] = useState("");

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
    console.log("[Registration] checkTeam started");
    setError(null);
    setPhase("checking");
    try {
      console.log("[Registration] Fetching teams...");
      const res = await fetch("/api/registration/teams", { method: "GET" });
      console.log("[Registration] Response status:", res.status);

      if (res.status === 401) {
        console.log("[Registration] User not authenticated (401)");
        setPhase("idle");
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to check team (${res.status})`);
      }
      const list = (await res.json()) as Array<{ id: number }>;
      console.log("[Registration] Teams found:", list.length);

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
      console.error("[Registration] checkTeam Error:", e);
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
    if (!members[0].id_document || !members[1].id_document) {
      // If editing, we might not have files.
      if (phase !== "editing") return setError("Both ID documents are required.");
    }

    setPhase("checking");

    try {
      const fd = new FormData();
      fd.append("team_name", teamName.trim());
      // Admin handles payment_status; users default to false.

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
      if (members[0].id_document) {
        fd.append("members[0][id_document]", members[0].id_document);
      }
      if (members[1].id_document) {
        fd.append("members[1][id_document]", members[1].id_document);
      }

      let url = "/api/registration/teams";
      let method = "POST";

      if (phase === "editing" && team) {
        url = `/api/registration/teams/${team.id}`;
        method = "PUT"; // or PATCH depending on your backend, but standard is usually PUT for updates in this app context? 
        // Backend 'update' usually supports PUT/PATCH.
      }

      const res = await fetch(url, { method, body: fd });
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

  async function deleteTeam() {
    if (!window.confirm("Are you sure you want to delete your team? This will remove all your data and you will need to register again.")) return;

    if (!team) return;
    setPhase("checking");
    try {
      const res = await fetch(`/api/registration/teams/${team.id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete team");
      }
      setTeam(null);
      setPhase("noTeam");
      // Reset form
      setTeamName("");
      setMembers([
        { name: "", nationality: "EG", email: "", phone_number: "", university: "NU", national_id: "", birth_year: "", id_document: null },
        { name: "", nationality: "EG", email: "", phone_number: "", university: "NU", national_id: "", birth_year: "", id_document: null },
      ]);
    } catch (e: any) {
      setError(e?.message || "Failed to cancel team");
      setPhase("error");
    }
  }

  function startEditing() {
    if (!team) return;
    setTeamName(team.team_name);
    setMembers(team.members.map(m => ({
      name: m.name,
      nationality: m.nationality,
      email: m.email,
      phone_number: m.phone_number,
      university: m.university,
      national_id: m.national_id,
      birth_year: String(m.birth_year),
      id_document: null
    })));
    setPhase("editing");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setTeam(null);
    setPhase("idle");
    setError(null);
  }

  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-bright/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container-md py-12 relative z-10 px-4">
        <header className="text-center mb-10">
          <h1 className="font-pixel text-4xl sm:text-6xl text-teal-bright pixel-outline drop-shadow-sm">
            REGISTRATION
          </h1>
          <div className="h-1 w-24 bg-teal-bright mx-auto mt-4 rounded-full opacity-60"></div>
        </header>


        {(error || googleError) && (
          <div className="mb-8 rounded-2xl border border-red/20 bg-red/5 p-4 text-sm text-red font-semibold text-center animate-pulse">
            {error || googleError}
          </div>
        )}

        <div className="rounded-[2.5rem] border border-line/60 bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-soft transition-all duration-300 hover:shadow-lg">
          {(phase === "idle") && (
            <div className="flex flex-col items-center gap-8 text-center py-8">
              <div className="bg-teal-bright/10 p-6 rounded-full mb-2">
                {/* Simple icon or graphic could go here */}
                <div className="w-12 h-12 rounded-full bg-teal-bright animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ink">Welcome, Challenger!</h2>
                <p className="text-muted max-w-md mx-auto">
                  To assume your position in the arena, please authenticate with your Google account.
                </p>
              </div>

              <div className="flex flex-row flex-wrap justify-center gap-4 mt-2">
                <PixelButton onClick={startGoogleLogin} variant="primary" size="sm">
                  {isGoogleLoading ? "CONNECTING..." : "LOGIN WITH GOOGLE"}
                </PixelButton>
                <PixelButton href="/" variant="ghost" size="sm">
                  RETURN HOME
                </PixelButton>
              </div>
            </div>
          )}

          {phase === "checking" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 border-4 border-teal-bright border-t-transparent rounded-full animate-spin"></div>
              <p className="text-ink font-semibold animate-pulse">Retrieving Data...</p>
            </div>
          )}

          {phase === "hasTeam" && team && (
            <TeamView
              team={team}
              onLogout={logout}
              onEdit={startEditing}
              onDelete={deleteTeam}
            />
          )}

          {(phase === "noTeam" || phase === "editing") && (
            <RegistrationForm
              isEditing={phase === "editing"}
              teamName={teamName}
              setTeamName={setTeamName}
              members={members}
              setMembers={setMembers}
              onSubmit={submitRegistration}
              onLogout={logout}
              onCancel={phase === "editing" ? () => setPhase("hasTeam") : undefined}
            />
          )}

          {phase === "error" && (
            <div className="text-center py-12">
              <p className="text-red font-bold text-lg mb-6">Something went wrong.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <PixelButton onClick={checkTeam} variant="primary" size="sm">
                  RETRY
                </PixelButton>
                <PixelButton onClick={logout} variant="ghost" size="sm">
                  LOGOUT
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TeamView({
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
          <h2 className="font-pixel text-3xl text-ink2 mb-2">YOUR TEAM</h2>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-bright"></span>
            Manage your roster and status.
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <PixelButton onClick={onEdit} variant="primary" size="sm">
            EDIT TEAM
          </PixelButton>
          <PixelButton onClick={onDelete} variant="outline-red" size="sm">
            DELETE TEAM
          </PixelButton>
          <PixelButton onClick={onLogout} variant="ghost" size="sm">
            LOGOUT
          </PixelButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 bg-bg/50 p-6 rounded-2xl border border-line/50">
        <InfoRow label="Team Name" value={team.team_name} large />
        <InfoRow
          label="Verification Status"
          value={team.payment_status ? "Verified / Paid ✅" : "Pending Verif. ⏳"}
          highlight={team.payment_status}
        />
        <InfoRow
          label="Competition Status"
          value={team.checked_in ? "ELIGIBLE TO COMPETE 🚀" : "Not yet eligible"}
          highlight={team.checked_in}
        />
      </div>

      <div>
        <h3 className="font-pixel text-xl text-ink2 mb-6">TEAM MEMBERS</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {team.members.map((m, i) => (
            <div key={m.id} className="group relative rounded-2xl border border-line bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-teal/30">
              <div className="absolute top-4 right-4 text-xs font-bold text-gray-200 group-hover:text-teal/20 pointer-events-none text-4xl font-pixel">
                0{i + 1}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-lg text-ink truncate pr-2">{m.name}</p>
                  {m.nu_student && <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[10px] font-bold uppercase tracking-wider border border-teal/20">NU Student</span>}
                </div>
                <p className="text-sm text-muted">{m.email}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-line/50">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Phone" value={m.phone_number} compact />
                  <InfoRow label="National ID" value={m.national_id} compact />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Nationality" value={m.nationality} compact />
                  <InfoRow label="Birth Year" value={String(m.birth_year)} compact />
                </div>
                <InfoRow label="University" value={m.university} compact />

                {m.id_document && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-muted">ID Document</span>
                    <a
                      href={m.id_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal hover:underline font-bold flex items-center gap-1"
                    >
                      View Document ↗
                    </a>
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

function RegistrationForm({
  isEditing = false,
  teamName,
  setTeamName,
  members,
  setMembers,
  onSubmit,
  onLogout,
  onCancel,
}: {
  isEditing?: boolean;
  teamName: string;
  setTeamName: (v: string) => void;
  members: MemberDraft[];
  setMembers: (v: MemberDraft[]) => void;
  onSubmit: () => void;
  onLogout: () => void;
  onCancel?: () => void;
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
          <PixelButton onClick={onLogout} variant="ghost" size="sm">
            LOGOUT
          </PixelButton>
        </div>
      </div>

      <div className="mb-10 max-w-lg">
        <label className="text-sm font-bold text-ink uppercase tracking-wider block mb-2">Team Name</label>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full h-12 rounded-xl border border-line bg-bg/50 px-4 transition-all focus:border-teal focus:ring-2 focus:ring-teal/20 focus:bg-white outline-none font-medium"
          placeholder="e.g. The Bug Slayers"
        />
      </div>

      <div className="space-y-12">
        <div className="relative p-6 rounded-3xl border border-line/60 bg-white/50">
          <div className="absolute -top-3 left-6 bg-white px-2 font-pixel text-lg text-teal-bright">MEMBER 01</div>
          <MemberForm
            value={members[0]}
            onChange={(next) => setMembers([next, members[1]])}
          />
        </div>

        <div className="relative p-6 rounded-3xl border border-line/60 bg-white/50">
          <div className="absolute -top-3 left-6 bg-white px-2 font-pixel text-lg text-teal-bright">MEMBER 02</div>
          <MemberForm
            value={members[1]}
            onChange={(next) => setMembers([members[0], next])}
          />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 pt-6 border-t border-line justify-end">
        <PixelButton href="/" variant="ghost" size="sm">
          DISCARD
        </PixelButton>
        <PixelButton onClick={onSubmit} variant="primary" size="sm">
          {isEditing ? "SAVE CHANGES" : "SUBMIT REGISTRATION"}
        </PixelButton>
      </div>
    </div>
  );
}

function MemberForm({ value, onChange }: { value: MemberDraft; onChange: (v: MemberDraft) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <Field label="Full Name">
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="input-modern"
          placeholder="e.g. Omar Ahmed"
        />
      </Field>

      <Field label="Email Address">
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="input-modern"
          placeholder="name@example.com"
          type="email"
        />
      </Field>

      <Field label="Phone number">
        <input
          value={value.phone_number}
          onChange={(e) => onChange({ ...value, phone_number: e.target.value })}
          className="input-modern"
          placeholder="+20 1xx xxx xxxx"
        />
      </Field>

      <Field label="Nationality">
        <input
          value={value.nationality}
          onChange={(e) => onChange({ ...value, nationality: e.target.value.toUpperCase() })}
          className="input-modern uppercase"
          placeholder="EG"
          maxLength={2}
        />
      </Field>

      <Field label="University">
        <select
          value={value.university}
          onChange={(e) => onChange({ ...value, university: e.target.value })}
          className="input-modern bg-transparent"
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
          className="input-modern"
          placeholder="14-digit ID"
        />
      </Field>

      <Field label="Birth Year (1999–2009)">
        <input
          value={value.birth_year}
          onChange={(e) => onChange({ ...value, birth_year: e.target.value })}
          className="input-modern"
          placeholder="YYYY"
          maxLength={4}
        />
      </Field>

      <Field label="ID Document">
        <div className="relative">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => onChange({ ...value, id_document: e.target.files?.[0] || null })}
            className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-bright/10 file:text-teal-bright hover:file:bg-teal-bright/20 cursor-pointer"
          />
        </div>
        {value.id_document && (
          <p className="mt-1 text-xs text-teal">Attached: {value.id_document.name}</p>
        )}
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-muted uppercase tracking-wider ml-1">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({
  label,
  value,
  compact,
  large,
  highlight,
}: {
  label: string;
  value: string;
  compact?: boolean;
  large?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={compact ? "flex justify-between items-baseline gap-4 py-1" : "flex flex-col gap-1"}>
      <span className={`text-muted ${compact ? "text-xs" : "text-xs font-bold uppercase tracking-wide"}`}>{label}</span>
      <span className={`text-ink font-medium ${large ? "text-xl" : "text-sm"} ${highlight ? "text-teal font-bold" : ""} ${compact ? "text-right" : ""}`}>
        {value}
      </span>
    </div>
  );
}
