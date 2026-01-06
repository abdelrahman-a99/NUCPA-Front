import { useState, useEffect, useMemo } from "react";
import { MemberDraft, TeamDetails } from "@/lib/registration-data";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

export function useRegistration() {
  const [phase, setPhase] = useState<
    "idle" | "checking" | "hasTeam" | "noTeam" | "editing" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberDraft[]>(() => [
    {
      name: "", nationality: "EG", email: "", phone_number: "", university: "NU",
      major: "", year_of_study: "FRESHMAN", university_other: "", national_id: "",
      birth_date: "", nu_id: "", codeforces_handle: "", vjudge_handle: "",
      id_document: null, nu_id_document: null,
    },
    {
      name: "", nationality: "EG", email: "", phone_number: "", university: "NU",
      major: "", year_of_study: "FRESHMAN", university_other: "", national_id: "",
      birth_date: "", nu_id: "", codeforces_handle: "", vjudge_handle: "",
      id_document: null, nu_id_document: null,
    },
  ]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    checkTeam();
  }, []);

  function validateField(fieldName: string, value: any, currentMembers: MemberDraft[], currentTeamName: string): string | undefined {
    if (fieldName === "team_name") {
      if (!currentTeamName.trim()) return "Team name is required.";
      if (currentTeamName.length > 40) return "Team name cannot exceed 40 characters.";
      if (!/^[A-Za-z0-9]/.test(currentTeamName.trim())) return "Team name must start with a letter or number.";
      return undefined;
    }

    const memberMatch = fieldName.match(/^member(\d)_(.+)$/);
    if (memberMatch) {
      const index = parseInt(memberMatch[1]);
      const key = memberMatch[2];
      const m = currentMembers[index];

      if (key === "name") {
        if (!m.name.trim()) return "Full name is required.";
        if (m.name.trim().length < 7) return "Full name must be at least 7 characters.";
        if (!/^[a-zA-Z\s]+$/.test(m.name.trim())) return "Full name must only contain letters and spaces.";
      }
      if (key === "email") {
        if (!m.email.trim()) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(m.email)) return "Invalid email format.";
        if (!m.email.toLowerCase().endsWith("@gmail.com")) return "Only Gmail addresses are allowed.";
      }
      if (key === "phone_number") {
        if (!m.phone_number.trim()) return "Phone number is required.";
        if (!/^[0-9+\s]+$/.test(m.phone_number.trim())) return "Phone number must contain only numbers.";
        if (m.phone_number.trim().replace(/[\s+]/g, '').length < 7) return "Phone number is too short.";
      }
      if (key === "nationality") {
        if (!m.nationality.trim()) return "Nationality is required.";
      }
      if (key === "university_other") {
        if (m.university === "OTHER" && !m.university_other.trim()) return "Please specify your university.";
      }
      if (key === "national_id") {
        if (!m.national_id.trim()) return "National ID / Passport is required.";
        if (m.nationality === "EG") {
          if (!/^\d{14}$/.test(m.national_id)) return "Egyptian National ID must be 14 digits.";
        } else {
          if (!/^[a-zA-Z0-9]+$/.test(m.national_id)) return "Passport ID must only contain letters and numbers.";
          if (m.national_id.length < 6 || m.national_id.length > 15) return "Passport ID must be 6–15 characters.";
        }
        const otherIndex = index === 0 ? 1 : 0;
        if (m.national_id && currentMembers[otherIndex].national_id === m.national_id) {
          return "Members must have different National IDs.";
        }
      }
      if (key === "birth_date") {
        if (!m.birth_date) return "Birth date is required.";
        const bDate = new Date(m.birth_date);
        const bYear = bDate.getFullYear();
        if (isNaN(bYear) || bYear < 1999 || bYear > 2009) return "Birth year must be 1999–2009.";
      }
      if (key === "id_document") {
        if (m.id_document && m.id_document.size > 5 * 1024 * 1024) return "File too large. Max size is 5MB.";
        if (phase !== "editing" && !m.id_document) return "ID document is required.";
        if (phase === "editing" && !m.id_document && !m.existing_id_url) return "ID document is required.";
      }
      if (key === "nu_id") {
        if (m.university === "NU" && !m.nu_id.trim()) return "NU ID is required.";
      }
      if (key === "nu_id_document") {
        if (m.university === "NU") {
          if (m.nu_id_document && m.nu_id_document.size > 5 * 1024 * 1024) return "File too large. Max size is 5MB.";
          if (phase !== "editing" && !m.nu_id_document) return "NU Student ID is required.";
          if (phase === "editing" && !m.nu_id_document && !m.existing_nu_id_url) return "NU Student ID is required.";
        }
      }
    }
    return undefined;
  }

  function handleBlur(fieldName: string) {
    const error = validateField(fieldName, null, members, teamName);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error || "" }));
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    const tnErr = validateField("team_name", null, members, teamName);
    if (tnErr) errors["team_name"] = tnErr;

    members.forEach((_, i) => {
      [
        "name", "email", "phone_number", "nationality", "university_other",
        "national_id", "birth_date", "id_document", "nu_id", "nu_id_document"
      ].forEach(key => {
        const fieldName = `member${i}_${key}`;
        const err = validateField(fieldName, null, members, teamName);
        if (err) errors[fieldName] = err;
      });
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submitRegistration() {
    setError(null);
    setFieldErrors({});
    if (!validateForm()) return;
    setPhase("checking");
    try {
      const fd = new FormData();
      fd.append("team_name", teamName.trim());
      const membersJson = members.map((m) => ({
        name: m.name.trim(),
        nationality: m.nationality.trim() || "EG",
        email: m.email.trim(),
        phone_number: m.phone_number.trim(),
        university: m.university,
        major: m.major.trim(),
        year_of_study: m.year_of_study,
        university_other: m.university === "OTHER" ? m.university_other.trim() : null,
        national_id: m.national_id.trim(),
        birth_date: m.birth_date,
        nu_id: m.university === "NU" ? m.nu_id.trim() : null,
        codeforces_handle: m.codeforces_handle?.trim() || null,
        vjudge_handle: m.vjudge_handle?.trim() || null,
      }));
      fd.append("members", JSON.stringify(membersJson));
      if (members[0].id_document) fd.append("members[0][id_document]", members[0].id_document);
      if (members[1].id_document) fd.append("members[1][id_document]", members[1].id_document);
      if (members[0].nu_id_document) fd.append("members[0][nu_id_document]", members[0].nu_id_document);
      if (members[1].nu_id_document) fd.append("members[1][nu_id_document]", members[1].nu_id_document);

      let url = "/api/registration/teams";
      let method = "POST";
      if (phase === "editing" && team) {
        url = `/api/registration/teams/${team.id}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      if (res.status === 401) {
        setPhase("idle");
        setError("Your session expired. Please login again.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (typeof data === 'object' && data !== null) {
          const newErrors: Record<string, string> = {};
          if (data.team_name) newErrors["team_name"] = Array.isArray(data.team_name) ? data.team_name[0] : data.team_name;
          if (data.members && Array.isArray(data.members)) {
            data.members.forEach((mErr: any, i: number) => {
              if (typeof mErr === 'object') {
                Object.keys(mErr).forEach(key => {
                  newErrors[`member${i}_${key}`] = Array.isArray(mErr[key]) ? mErr[key][0] : mErr[key];
                });
              } else if (typeof mErr === 'string') {
                newErrors[`member${i}_national_id`] = mErr;
              }
            });
          }
          if (data.error) setError(data.error);
          if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            setPhase(phase === "editing" ? "editing" : "noTeam");
            return;
          }
        }
        throw new Error(data.error || data.detail || `Registration failed (${res.status})`);
      }
      await checkTeam();
    } catch (e: any) {
      setError(e?.message || "Registration failed.");
      setPhase(phase === "editing" ? "editing" : "noTeam");
    }
  }

  async function deleteTeam() {
    if (!window.confirm("Are you sure you want to delete your team? This will remove all your data and you will need to register again.")) return;
    if (!team) return;
    setPhase("checking");
    try {
      const res = await fetch(`/api/registration/teams/${team.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete team");
      setTeam(null);
      setPhase("noTeam");
      setTeamName("");
      setMembers([
        { name: "", nationality: "EG", email: "", phone_number: "", university: "NU", major: "", year_of_study: "FRESHMAN", university_other: "", national_id: "", birth_date: "", nu_id: "", id_document: null, nu_id_document: null },
        { name: "", nationality: "EG", email: "", phone_number: "", university: "NU", major: "", year_of_study: "FRESHMAN", university_other: "", national_id: "", birth_date: "", nu_id: "", id_document: null, nu_id_document: null },
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
      name: m.name, nationality: m.nationality, email: m.email, phone_number: m.phone_number,
      university: m.university, major: m.major || "", year_of_study: m.year_of_study || "FRESHMAN",
      university_other: m.university_other || "", national_id: m.national_id, birth_date: m.birth_date || "",
      nu_id: m.nu_id || "", codeforces_handle: m.codeforces_handle || "", vjudge_handle: m.vjudge_handle || "",
      id_document: null, nu_id_document: null, existing_id_url: m.id_document, existing_nu_id_url: m.nu_id_document
    })));
    setPhase("editing");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setTeam(null);
    setPhase("idle");
    setError(null);
  }

  return {
    phase, setPhase, error, team, teamName, setTeamName, members, setMembers, fieldErrors,
    startGoogleLogin, isGoogleLoading, googleError, checkTeam, submitRegistration,
    deleteTeam, startEditing, logout, handleBlur
  };
}
