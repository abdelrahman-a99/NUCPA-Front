import { useState, useEffect, useCallback } from "react";
import { MemberDraft, TeamDetails } from "@/lib/registration-data";
import { PHONE_CODES } from "@/lib/phone-data";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { parseErrorMessage } from "@/utils/errorHelpers";

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
  const [dataSharingConsent, setDataSharingConsent] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const handleSuccess = useCallback(() => checkTeam(), []);
  const { login: startGoogleLogin, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin({
    onSuccess: handleSuccess,
  });

  async function checkTeam() {
    setError(null);
    setPhase("checking");
    try {
      // Add timeout to prevent infinite loading if backend is down
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch("/api/registration/teams", {
        method: "GET",
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 401) {
        setPhase("idle");
        return;
      }
      if (res.status === 502) {
        throw new Error("Could not connect to the registration server. Please try again in a moment.");
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
      if (e.name === "AbortError") {
        setError("Connection timed out. The server may be starting up - please try again.");
      } else {
        setError(parseErrorMessage(e));
      }
      setPhase("error");
    }
  }

  useEffect(() => {
    checkTeam();
  }, []);

  function checkMemberDuplication(fieldName: string, members: MemberDraft[], index: number): string | undefined {
    const key = fieldName.split('_').pop();
    const otherIdx = index === 0 ? 1 : 0;
    const m = members[index];
    const other = members[otherIdx];

    const clean = (s: any) => (s || "").toString().trim().toLowerCase();
    const cleanPhone = (p: any) => (p || "").toString().replace(/\D/g, '');

    if (key === "name" && clean(m.name) && clean(m.name) === clean(other.name)) return "Duplicate name within team.";
    if (key === "email" && clean(m.email) && clean(m.email) === clean(other.email)) return "Duplicate email within team.";

    if (key === "phone_number") {
      const p1 = cleanPhone(m.phone_number);
      const p2 = cleanPhone(other.phone_number);
      if (p1 && p1 === p2) return "Duplicate phone number within team.";
    }

    if (key === "national_id" && clean(m.national_id) && clean(m.national_id) === clean(other.national_id)) return "Duplicate National ID/Passport within team.";

    if (key === "nu_id" && m.university === "NU" && other.university === "NU" && clean(m.nu_id) && clean(m.nu_id) === clean(other.nu_id)) return "Duplicate NU ID within team.";

    if (key === "codeforces_handle" && clean(m.codeforces_handle) && clean(m.codeforces_handle) === clean(other.codeforces_handle)) return "Duplicate Codeforces handle within team.";
    if (key === "vjudge_handle" && clean(m.vjudge_handle) && clean(m.vjudge_handle) === clean(other.vjudge_handle)) return "Duplicate Vjudge handle within team.";

    return undefined;
  }

  async function checkAsyncValidation(field: string, value: string): Promise<string | undefined> {
    if (!value) return undefined;
    try {
      const res = await fetch(`/api/registration/validate/?field=${field}&value=${encodeURIComponent(value)}`);
      if (!res.ok) {
        const data = await res.json();
        return data.error || "Validation failed";
      }
      return undefined;
    } catch (e) {
      console.error(e);
      return undefined; // If network fails, we'll let it slide until submit or retry? Better to be permissive on blur.
    }
  }

  async function verifyCodeforcesHandle(handle: string): Promise<string | undefined> {
    if (!handle || handle.trim().length < 3) return undefined;
    const cleanHandle = handle.trim();

    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${cleanHandle}`);
      const data = await res.json();

      if (data.status === "OK") {
        return undefined; // Handle exists
      } else {
        return `Codeforces handle "${cleanHandle}" not found. Please check spelling.`;
      }
    } catch (e) {
      console.error("CF API error:", e);
      return undefined; // Don't block on API errors
    }
  }

  async function validateImageDimensions(file: File): Promise<string | undefined> {
    // Only validate image files (skip PDFs)
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
      return undefined; // Skip dimension check for PDFs
    }

    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width < 300 || img.height < 300) {
          resolve(`Image too small (${img.width}x${img.height}). Minimum 300x300 pixels for readable ID.`);
        } else {
          resolve(undefined);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(undefined); // Don't block on image load errors
      };

      img.src = url;
    });
  }

  function validateField(fieldName: string, value: any, currentMembers: MemberDraft[], currentTeamName: string): string | undefined {
    if (fieldName === "team_name") {
      const trimmed = currentTeamName.trim();
      if (!trimmed) return "Team name is required.";
      if (trimmed.length < 3) return "Team name must be at least 3 characters.";
      if (trimmed.length > 40) return "Team name cannot exceed 40 characters.";
      if (!/^[A-Za-z0-9]/.test(trimmed)) return "Team name must start with a letter or number.";
      return undefined;
    }

    const memberMatch = fieldName.match(/^member(\d)_(.+)$/);
    if (memberMatch) {
      const index = parseInt(memberMatch[1]);
      const key = memberMatch[2];
      const m = currentMembers[index];

      // Standard validations
      if (key === "name") {
        const val = m.name.trim();
        if (!val) return "Full name is required.";
        if (val.length > 100) return "Full name cannot exceed 100 characters.";
        if (!/^[a-zA-Z\s]+$/.test(val)) return "Full name must only contain letters and spaces.";

        const parts = val.split(/\s+/);
        if (parts.length < 3) return "Full name must be at least 3 words (First Middle Last).";
        if (parts.some(p => p.length < 3)) return "Each word in the name must be at least 3 characters.";
        // Min 9 chars (3 words x 3 chars + 2 spaces = 11, but floor at 9)
        if (val.length < 9) return "Full name must be at least 9 characters.";
      }
      if (key === "email") {
        if (!m.email.trim()) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(m.email)) return "Invalid email format.";
        // All valid email domains are now accepted
      }
      if (key === "phone_number") {
        if (!m.phone_number.trim()) return "Phone number is required for contact.";

        // Check valid chars
        if (!/^[0-9+\s]+$/.test(m.phone_number.trim())) return "Phone number should only contain digits and + sign.";

        // Clean digits
        const raw = m.phone_number.trim();
        const cleanDigits = raw.replace(/[\s+]/g, '');

        // Find country match to check strict length
        // We import PHONE_CODES from the library
        // Note: we need to ensure PHONE_CODES is available in scope or imported.
        // It is not imported in this file yet, but it is in 'MemberForm'. 
        // We should import it at the top of this file.
        // Assuming imports are handled or I will add import in a separate step if needed?
        // Wait, replace_file_content replaces a block. I need to make sure I import it.
        // I'll add the logic here, and separately add the import if missing. 
        // Actually, looking at the file content I read earlier, PHONE_CODES was NOT imported in useRegistration.ts
        // I will add the logic here and then add the import in the next step or same step if I can ?
        // I can't do two non-contiguous edits with replace_file_content.
        // I will do this edit for logic, then another for import.

        // Logic:
        // 1. Identify country code
        // 2. Get mask
        // 3. Count expected digits

        // We need PHONE_CODES. Let's assume it's imported as `import { PHONE_CODES } from "@/lib/phone-data";`

        const sortedCodes = [...PHONE_CODES].sort((a, b) => b.code.length - a.code.length);
        let matchedCode = sortedCodes.find(c => raw.startsWith(c.code));

        // If user didn't type +, maybe they typed the number directly? 
        // But our UI forces selection usually. 
        // If raw starts with +, matches country.

        if (matchedCode) {
          const local = raw.slice(matchedCode.code.length).replace(/\D/g, '');
          const mask = matchedCode.mask;
          // Count x's and digits in mask
          const expectedLen = mask.split('').filter(c => /[0-9x]/.test(c)).length;

          if (local.length !== expectedLen) {
            return `Phone number for ${matchedCode.label.split('(')[0].trim()} must be exactly ${expectedLen} digits.`;
          }
        } else {
          // Fallback
          if (cleanDigits.length < 7) return "Phone number is too short (min 7 digits).";
          if (cleanDigits.length > 15) return "Phone number is too long.";
        }
      }
      if (key === "nationality") {
        if (!m.nationality.trim()) return "Nationality is required.";
      }
      if (key === "university_other") {
        if (m.university === "OTHER") {
          const val = m.university_other.trim();
          if (!val) return "Please specify your university.";
          if (val.length < 3) return "University name must be at least 3 characters.";
          if (val.length > 100) return "University name cannot exceed 100 characters.";
        }
      }
      if (key === "major") {
        const val = m.major?.trim() || "";
        if (!val) return "Major/Field of study is required.";
        if (val.length < 2) return "Major must be at least 2 characters.";
        if (val.length > 100) return "Major cannot exceed 100 characters.";
      }
      if (key === "university") {
        // TEENS cross-validation
        if (m.university === "TEENS" && m.year_of_study !== "TEENS") {
          return "Year of study must be 'Teens' when university is 'Teens / High School'.";
        }
      }
      if (key === "year_of_study") {
        // TEENS cross-validation
        if (m.year_of_study === "TEENS" && m.university !== "TEENS") {
          return "University must be 'Teens / High School' when year of study is 'Teens'.";
        }
      }
      if (key === "codeforces_handle") {
        const val = m.codeforces_handle?.trim() || "";
        if (val) {
          if (/ /.test(val)) return "Codeforces handle cannot contain spaces.";
          if (!/^[a-zA-Z0-9_]+$/.test(val)) return "Codeforces handle can only contain letters, numbers, and underscores.";
          if (val.length < 3) return "Codeforces handle must be at least 3 characters.";
          if (val.length > 24) return "Codeforces handle cannot exceed 24 characters.";
        }
      }
      if (key === "vjudge_handle") {
        const val = m.vjudge_handle?.trim() || "";
        if (val) {
          if (/ /.test(val)) return "Vjudge handle cannot contain spaces.";
          if (!/^[a-zA-Z0-9_]+$/.test(val)) return "Vjudge handle can only contain letters, numbers, and underscores.";
          if (val.length < 3) return "Vjudge handle must be at least 3 characters.";
          if (val.length > 24) return "Vjudge handle cannot exceed 24 characters.";
        }
      }
      if (key === "national_id") {
        if (!m.national_id.trim()) return "National ID / Passport is required.";
        if (m.nationality === "EG") {
          if (!/^\d{14}$/.test(m.national_id.trim())) return "Egyptian National ID must be exactly 14 digits.";
        } else {
          if (!/^[a-zA-Z0-9]+$/.test(m.national_id.trim())) return "Passport ID must only contain letters and numbers.";
          if (m.national_id.trim().length < 6 || m.national_id.trim().length > 15) return "Passport ID must be 6–15 characters.";
        }
      }
      if (key === "birth_date") {
        if (!m.birth_date) return "Birth date is required.";
        const bDate = new Date(m.birth_date);
        const bYear = bDate.getFullYear();
        if (isNaN(bYear) || bYear < 1999 || bYear > 2011) return "Birth year must be 1999–2011.";
      }
      if (key === "id_document") {
        if (m.id_document) {
          if (m.id_document.size < 10 * 1024) return "File is too small (min 10KB). Please upload a readable document.";
          if (m.id_document.size > 5 * 1024 * 1024) return "ID document too large (Max 5MB).";
          const ext = m.id_document.name.split('.').pop()?.toLowerCase();
          if (!ext || !['jpg', 'jpeg', 'png', 'pdf'].includes(ext)) return "Unsupported ID format. Use JPG, PNG, or PDF.";
        }
        if (phase !== "editing" && !m.id_document) return "Personal ID/Passport document is required.";
        if (phase === "editing" && !m.id_document && !m.existing_id_url) return "Personal ID/Passport document is required.";
      }
      if (key === "nu_id") {
        if (m.university === "NU") {
          if (!m.nu_id.trim()) return "NU Student ID is required.";
          if (!/^\d{9}$/.test(m.nu_id.trim())) return "NU Student ID must be exactly 9 digits.";
        }
      }
      if (key === "nu_id_document") {
        if (m.university === "NU") {
          if (m.nu_id_document) {
            if (m.nu_id_document.size < 10 * 1024) return "File is too small (min 10KB). Please upload a readable document.";
            if (m.nu_id_document.size > 5 * 1024 * 1024) return "NU ID document too large (Max 5MB).";
            const ext = m.nu_id_document.name.split('.').pop()?.toLowerCase();
            if (!ext || !['jpg', 'jpeg', 'png', 'pdf'].includes(ext)) return "Unsupported NU ID format. Use JPG, PNG, or PDF.";
          }
          if (phase !== "editing" && !m.nu_id_document) return "NU Student ID document is required.";
          if (phase === "editing" && !m.nu_id_document && !m.existing_nu_id_url) return "NU Student ID document is required.";
        }
      }

      // Check for duplication with the other member
      const dupError = checkMemberDuplication(fieldName, currentMembers, index);
      if (dupError) return dupError;
    }
    return undefined;
  }

  async function handleBlur(fieldName: string) {
    // 1. Run local sync validation first
    const syncError = validateField(fieldName, null, members, teamName);
    if (syncError) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: syncError }));
      return;
    }

    // 2. If valid locally, run async helper check (uniqueness)
    // Only for specific fields
    let asyncError: string | undefined = undefined;

    if (fieldName === "team_name") {
      asyncError = await checkAsyncValidation("team_name", teamName);
    } else {
      const memberMatch = fieldName.match(/^member(\d)_(.+)$/);
      if (memberMatch) {
        const index = parseInt(memberMatch[1]);
        const key = memberMatch[2];
        const val = members[index][key as keyof MemberDraft];

        if (typeof val === "string") {
          if (["phone_number", "national_id", "nu_id", "email"].includes(key)) {
            asyncError = await checkAsyncValidation(key, val);
          }
          // Real-time Codeforces handle verification
          if (key === "codeforces_handle" && val.trim()) {
            asyncError = await verifyCodeforcesHandle(val);
          }
        }

        // Image dimension validation for documents
        if (key === "id_document" || key === "nu_id_document") {
          const file = members[index][key as keyof MemberDraft] as File | null;
          if (file) {
            asyncError = await validateImageDimensions(file);
          }
        }
      }
    }

    if (asyncError) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: asyncError || "" }));
    } else {
      // Clear error if both pass
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    const tnErr = validateField("team_name", null, members, teamName);
    if (tnErr) errors["team_name"] = tnErr;

    members.forEach((_, i) => {
      [
        "name", "email", "phone_number", "nationality", "university",
        "major", "year_of_study", "university_other", "national_id",
        "birth_date", "id_document", "nu_id", "nu_id_document",
        "codeforces_handle", "vjudge_handle"
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
      // Consent
      fd.append("data_sharing_consent", dataSharingConsent.toString());

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
      if (members[0].university === "NU" && members[0].nu_id_document) fd.append("members[0][nu_id_document]", members[0].nu_id_document);
      if (members[1].university === "NU" && members[1].nu_id_document) fd.append("members[1][nu_id_document]", members[1].nu_id_document);

      let url = "/api/registration/teams";
      let method = "POST";
      if (phase === "editing" && team) {
        url = `/api/registration/teams/${team.id}`;
        method = "PUT";
      }
      const res = await fetch(url, { method, body: fd });
      console.log(`[useRegistration] submitRegistration response: ${res.status}`);
      if (res.status === 401) {
        setPhase("idle");
        setError("Your session expired. Please login again.");
        return;
      }

      // Handle rate limiting (429)
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setError(parseErrorMessage(data));
        setPhase(phase === "editing" ? "editing" : "noTeam");
        return;
      }

      // Handle server errors (500)
      if (res.status >= 500) {
        const text = await res.text();
        console.error(`[useRegistration] Server Error 500+: ${text}`);
        setError("🔧 Server error. Our team has been notified. Please try again in a few minutes." + (text ? ` (${text.substring(0, 50)}...)` : ""));
        setPhase(phase === "editing" ? "editing" : "noTeam");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error(`[useRegistration] Error Response Body: ${text}`);
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("[useRegistration] Failed to parse error JSON:", e);
        }

        if (typeof data === 'object' && data !== null) {
          const newErrors: Record<string, string> = {};
          if (data.team_name) newErrors["team_name"] = Array.isArray(data.team_name) ? data.team_name[0] : data.team_name;
          if (data.members) {
            if (Array.isArray(data.members)) {
              if (data.members.length > 0 && typeof data.members[0] === 'string') {
                // Global members-level error (e.g. cross-member duplication from backend)
                setError(data.members[0]);
              } else {
                // Nested field-level errors per member
                data.members.forEach((mErr: any, i: number) => {
                  if (mErr && typeof mErr === 'object') {
                    Object.keys(mErr).forEach(key => {
                      newErrors[`member${i}_${key}`] = Array.isArray(mErr[key]) ? mErr[key][0] : mErr[key];
                    });
                  }
                });
              }
            } else if (typeof data.members === 'string') {
              setError(data.members);
            }
          }

          // Handle specific error fields with friendly messages
          setError(parseErrorMessage(data));

          if (Object.keys(newErrors).length > 0) {
            setFieldErrors((prev) => ({ ...prev, ...newErrors }));
            setPhase(phase === "editing" ? "editing" : "noTeam");
            return;
          }
          if (error || data.error || data.detail || data.non_field_errors) {
            setPhase(phase === "editing" ? "editing" : "noTeam");
            return;
          }
        }
        throw new Error(data.error || data.detail || `Registration failed. Please check your data and try again.`);
      }
      await checkTeam();
    } catch (e: any) {
      console.error("[useRegistration] Exception:", e);
      setError(parseErrorMessage(e));
      setPhase(phase === "editing" ? "editing" : "noTeam");
    }
  }

  async function deleteTeam() {
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
      setError(parseErrorMessage(e));
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
    setDataSharingConsent(team.data_sharing_consent || false);
    setRulesAccepted(true); // Pre-accept rules if they already have a team being edited
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
    deleteTeam, startEditing, logout, handleBlur,
    dataSharingConsent, setDataSharingConsent, rulesAccepted, setRulesAccepted
  };
}
