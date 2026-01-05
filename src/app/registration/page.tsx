"use client";

import { useEffect, useMemo, useState } from "react";
import PixelButton from "@/components/ui/PixelButton";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  { value: "FAYOUM_UNIVERSITY", label: "FAYOM University" },
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

const COUNTRIES = [
  { value: "AF", label: "Afghanistan" }, { value: "AL", label: "Albania" }, { value: "DZ", label: "Algeria" },
  { value: "AD", label: "Andorra" }, { value: "AO", label: "Angola" }, { value: "AG", label: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina" }, { value: "AM", label: "Armenia" }, { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" }, { value: "AZ", label: "Azerbaijan" }, { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" }, { value: "BD", label: "Bangladesh" }, { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" }, { value: "BE", label: "Belgium" }, { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" }, { value: "BT", label: "Bhutan" }, { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia and Herzegovina" }, { value: "BW", label: "Botswana" }, { value: "BR", label: "Brazil" },
  { value: "BN", label: "Brunei" }, { value: "BG", label: "Bulgaria" }, { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" }, { value: "KH", label: "Cambodia" }, { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" }, { value: "CV", label: "Cape Verde" }, { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" }, { value: "CL", label: "Chile" }, { value: "CN", label: "China" },
  { value: "CO", label: "Colombia" }, { value: "KM", label: "Comoros" }, { value: "CG", label: "Congo" },
  { value: "CR", label: "Costa Rica" }, { value: "HR", label: "Croatia" }, { value: "CU", label: "Cuba" },
  { value: "CY", label: "Cyprus" }, { value: "CZ", label: "Czech Republic" }, { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" }, { value: "DM", label: "Dominica" }, { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" }, { value: "EG", label: "Egypt" }, { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" }, { value: "ER", label: "Eritrea" }, { value: "EE", label: "Estonia" },
  { value: "ET", label: "Ethiopia" }, { value: "FJ", label: "Fiji" }, { value: "FI", label: "Finland" },
  { value: "FR", label: "France" }, { value: "GA", label: "Gabon" }, { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" }, { value: "DE", label: "Germany" }, { value: "GH", label: "Ghana" },
  { value: "GR", label: "Greece" }, { value: "GD", label: "Grenada" }, { value: "GT", label: "Guatemala" },
  { value: "GN", label: "Guinea" }, { value: "GW", label: "Guinea-Bissau" }, { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" }, { value: "HN", label: "Honduras" }, { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" }, { value: "IN", label: "India" }, { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" }, { value: "IQ", label: "Iraq" }, { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" }, { value: "IT", label: "Italy" }, { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" }, { value: "JO", label: "Jordan" }, { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" }, { value: "KI", label: "Kiribati" }, { value: "KP", label: "North Korea" },
  { value: "KR", label: "South Korea" }, { value: "KW", label: "Kuwait" }, { value: "KG", label: "Kyrgyzstan" },
  { value: "LA", label: "Laos" }, { value: "LV", label: "Latvia" }, { value: "LB", label: "Lebanon" },
  { value: "LS", label: "Lesotho" }, { value: "LR", label: "Liberia" }, { value: "LY", label: "Libya" },
  { value: "LI", label: "Liechtenstein" }, { value: "LT", label: "Lithuania" }, { value: "LU", label: "Luxembourg" },
  { value: "MK", label: "Macedonia" }, { value: "MG", label: "Madagascar" }, { value: "MW", label: "Malawi" },
  { value: "MY", label: "Malaysia" }, { value: "MV", label: "Maldives" }, { value: "ML", label: "Mali" },
  { value: "MT", label: "Malta" }, { value: "MH", label: "Marshall Islands" }, { value: "MR", label: "Mauritania" },
  { value: "MU", label: "Mauritius" }, { value: "MX", label: "Mexico" }, { value: "FM", label: "Micronesia" },
  { value: "MD", label: "Moldova" }, { value: "MC", label: "Monaco" }, { value: "MN", label: "Mongolia" },
  { value: "ME", label: "Montenegro" }, { value: "MA", label: "Morocco" }, { value: "MZ", label: "Mozambique" },
  { value: "MM", label: "Myanmar" }, { value: "NA", label: "Namibia" }, { value: "NR", label: "Nauru" },
  { value: "NP", label: "Nepal" }, { value: "NL", label: "Netherlands" }, { value: "NZ", label: "New Zealand" },
  { value: "NI", label: "Nicaragua" }, { value: "NE", label: "Niger" }, { value: "NG", label: "Nigeria" },
  { value: "NO", label: "Norway" }, { value: "OM", label: "Oman" }, { value: "PK", label: "Pakistan" },
  { value: "PW", label: "Palau" }, { value: "PA", label: "Panama" }, { value: "PG", label: "Papua New Guinea" },
  { value: "PY", label: "Paraguay" }, { value: "PE", label: "Peru" }, { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" }, { value: "PT", label: "Portugal" }, { value: "QA", label: "Qatar" },
  { value: "RO", label: "Romania" }, { value: "RU", label: "Russia" }, { value: "RW", label: "Rwanda" },
  { value: "KN", label: "Saint Kitts and Nevis" }, { value: "LC", label: "Saint Lucia" }, { value: "VC", label: "Saint Vincent and the Grenadines" },
  { value: "WS", label: "Samoa" }, { value: "SM", label: "San Marino" }, { value: "ST", label: "Sao Tome and Principe" },
  { value: "SA", label: "Saudi Arabia" }, { value: "SN", label: "Senegal" }, { value: "RS", label: "Serbia" },
  { value: "SC", label: "Seychelles" }, { value: "SL", label: "Sierra Leone" }, { value: "SG", label: "Singapore" },
  { value: "SK", label: "Slovakia" }, { value: "SI", label: "Slovenia" }, { value: "SB", label: "Solomon Islands" },
  { value: "SO", label: "Somalia" }, { value: "ZA", label: "South Africa" }, { value: "SS", label: "South Sudan" },
  { value: "ES", label: "Spain" }, { value: "LK", label: "Sri Lanka" }, { value: "SD", label: "Sudan" },
  { value: "SR", label: "Suriname" }, { value: "SZ", label: "Swaziland" }, { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" }, { value: "SY", label: "Syria" }, { value: "TW", label: "Taiwan" },
  { value: "TJ", label: "Tajikistan" }, { value: "TZ", label: "Tanzania" }, { value: "TH", label: "Thailand" },
  { value: "TL", label: "Timor-Leste" }, { value: "TG", label: "Togo" }, { value: "TO", label: "Tonga" },
  { value: "TT", label: "Trinidad and Tobago" }, { value: "TN", label: "Tunisia" }, { value: "TR", label: "Turkey" },
  { value: "TM", label: "Turkmenistan" }, { value: "TV", label: "Tuvalu" }, { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" }, { value: "AE", label: "United Arab Emirates" }, { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" }, { value: "UY", label: "Uruguay" }, { value: "UZ", label: "Uzbekistan" },
  { value: "VU", label: "Vanuatu" }, { value: "VE", label: "Venezuela" }, { value: "VN", label: "Vietnam" },
  { value: "YE", label: "Yemen" }, { value: "ZM", label: "Zambia" }, { value: "ZW", label: "Zimbabwe" }
];

const YEAR_CHOICES = [
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHOMORE", label: "Sophomore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR1", label: "Senior 1" },
  { value: "SENIOR2", label: "Senior 2" },
  { value: "TEENS", label: "Teens / High School" },
];

type MemberDraft = {
  name: string;
  nationality: string; // Country code (EG, SA, US, ...)
  email: string;
  phone_number: string;
  university: string;
  major: string;
  year_of_study: string;
  university_other: string;
  national_id: string;
  birth_date: string; // YYYY-MM-DD
  nu_id: string;
  id_document: File | null;
  nu_id_document: File | null;
  existing_id_url?: string;
  existing_nu_id_url?: string;
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
    major?: string;
    year_of_study?: string;
    university_other?: string;
    national_id: string;
    birth_date: string;
    year: number;
    nu_student: boolean;
    nu_id?: string;
    id_document?: string;
    nu_id_document?: string;
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
      major: "",
      year_of_study: "FRESHMAN",
      university_other: "",
      national_id: "",
      birth_date: "",
      nu_id: "",
      id_document: null,
      nu_id_document: null,
    },
    {
      name: "",
      nationality: "EG",
      email: "",
      phone_number: "",
      university: "NU",
      major: "",
      year_of_study: "FRESHMAN",
      university_other: "",
      national_id: "",
      birth_date: "",
      nu_id: "",
      id_document: null,
      nu_id_document: null,
    },
  ]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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


  function validateForm() {
    const errors: Record<string, string> = {};

    if (!teamName.trim()) {
      errors["team_name"] = "Team name is required.";
    } else if (teamName.length > 40) {
      errors["team_name"] = "Team name cannot exceed 40 characters.";
    } else if (!/^[A-Za-z0-9]/.test(teamName.trim())) {
      errors["team_name"] = "Team name must start with a letter or number.";
    }

    members.forEach((m, i) => {
      const prefix = `member${i}_`;
      if (!m.name.trim()) errors[`${prefix}name`] = "Full name is required.";
      else if (m.name.trim().length < 7) errors[`${prefix}name`] = "Full name must be at least 7 characters.";
      else if (!/^[a-zA-Z\s]+$/.test(m.name.trim())) errors[`${prefix}name`] = "Full name must only contain letters and spaces.";

      if (!m.email.trim()) errors[`${prefix}email`] = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(m.email)) errors[`${prefix}email`] = "Invalid email format.";
      else if (!m.email.toLowerCase().endsWith("@gmail.com")) errors[`${prefix}email`] = "Only Gmail addresses are allowed.";

      if (!m.phone_number.trim()) {
        errors[`${prefix}phone_number`] = "Phone number is required.";
      } else if (!/^\d+$/.test(m.phone_number.trim())) {
        errors[`${prefix}phone_number`] = "Phone number must contain only numbers.";
      } else if (m.phone_number.trim().length < 10) {
        errors[`${prefix}phone_number`] = "Phone number must be at least 10 digits.";
      }

      if (!m.nationality.trim()) errors[`${prefix}nationality`] = "Nationality is required.";

      if (m.university === "OTHER" && !m.university_other.trim()) {
        errors[`${prefix}university_other`] = "Please specify your university.";
      }

      if (!m.national_id.trim()) {
        errors[`${prefix}national_id`] = "National ID / Passport is required.";
      } else {
        if (m.nationality === "EG") {
          if (!/^\d{14}$/.test(m.national_id)) {
            errors[`${prefix}national_id`] = "Egyptian National ID must be 14 digits.";
          }
        } else if (m.national_id.length < 6) {
          errors[`${prefix}national_id`] = "Passport number is too short.";
        }
      }

      if (!m.birth_date) {
        errors[`${prefix}birth_date`] = "Birth date is required.";
      } else {
        const bDate = new Date(m.birth_date);
        const bYear = bDate.getFullYear();
        if (isNaN(bYear) || bYear < 1999 || bYear > 2009) {
          errors[`${prefix}birth_date`] = "Birth year must be 1999–2009.";
        }
      }

      // File Size Check (5MB)
      if (m.id_document && m.id_document.size > 5 * 1024 * 1024) {
        errors[`${prefix}id_document`] = "File too large. Max size is 5MB.";
      } else if (phase !== "editing" && !m.id_document) {
        errors[`${prefix}id_document`] = "ID document is required.";
      } else if (phase === "editing" && !m.id_document && !m.existing_id_url) {
        errors[`${prefix}id_document`] = "ID document is required.";
      }

      // NU Student Validation
      if (m.university === "NU") {
        if (!m.nu_id.trim()) {
          errors[`${prefix}nu_id`] = "NU ID is required.";
        }
        if (m.nu_id_document && m.nu_id_document.size > 5 * 1024 * 1024) {
          errors[`${prefix}nu_id_document`] = "File too large. Max size is 5MB.";
        } else if (phase !== "editing" && !m.nu_id_document) {
          errors[`${prefix}nu_id_document`] = "NU Student ID is required.";
        } else if (phase === "editing" && !m.nu_id_document && !m.existing_nu_id_url) {
          errors[`${prefix}nu_id_document`] = "NU Student ID is required.";
        }
      }
    });

    if (members[0].national_id && members[1].national_id && members[0].national_id === members[1].national_id) {
      errors["member1_national_id"] = "Members must have different National IDs.";
    }

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
      }));

      fd.append("members", JSON.stringify(membersJson));

      if (members[0].id_document) {
        fd.append("members[0][id_document]", members[0].id_document);
      }
      if (members[1].id_document) {
        fd.append("members[1][id_document]", members[1].id_document);
      }
      if (members[0].nu_id_document) {
        fd.append("members[0][nu_id_document]", members[0].nu_id_document);
      }
      if (members[1].nu_id_document) {
        fd.append("members[1][nu_id_document]", members[1].nu_id_document);
      }

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
          // Flatten nested errors from backend
          const newErrors: Record<string, string> = {};
          if (data.team_name) newErrors["team_name"] = Array.isArray(data.team_name) ? data.team_name[0] : data.team_name;
          if (data.members && Array.isArray(data.members)) {
            data.members.forEach((mErr: any, i: number) => {
              if (typeof mErr === 'object') {
                Object.keys(mErr).forEach(key => {
                  newErrors[`member${i}_${key}`] = Array.isArray(mErr[key]) ? mErr[key][0] : mErr[key];
                });
              } else if (typeof mErr === 'string') {
                newErrors[`member${i}_national_id`] = mErr; // fallback
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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete team");
      }
      setTeam(null);
      setPhase("noTeam");
      // Reset form
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
      name: m.name,
      nationality: m.nationality,
      email: m.email,
      phone_number: m.phone_number,
      university: m.university,
      major: m.major || "",
      year_of_study: m.year_of_study || "FRESHMAN",
      university_other: m.university_other || "",
      national_id: m.national_id,
      birth_date: m.birth_date || "",
      nu_id: m.nu_id || "",
      id_document: null,
      nu_id_document: null,
      existing_id_url: m.id_document,
      existing_nu_id_url: m.nu_id_document
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
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />
      <main className="flex-grow bg-dots-about relative overflow-hidden">
        <div className="container-lg py-12 relative z-10 px-4">
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

          <div className="rounded-xl2 border border-line/60 bg-white shadow-soft transition-all duration-300 hover:shadow-lg p-5 sm:p-12">
            {(phase === "idle") && (
              <div className="flex flex-col items-center gap-8 text-center py-8">
                <div className="bg-teal-bright/10 p-6 rounded-full mb-2">
                  {/* Simple icon or graphic could go here */}
                  <div className="w-12 h-12 rounded-full bg-teal-bright animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-ink font-pixel">Welcome, Challenger!</h2>
                  <p className="text-muted max-w-md mx-auto font-medium">
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
                <p className="text-ink font-pixel animate-pulse">Retrieving Data...</p>
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
                fieldErrors={fieldErrors}
                onSubmit={submitRegistration}
                onLogout={logout}
                onCancel={phase === "editing" ? () => setPhase("hasTeam") : undefined}
              />
            )}

            {phase === "error" && (
              <div className="text-center py-12">
                <p className="font-pixel text-red font-bold text-lg mb-6">Something went wrong.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <PixelButton onClick={checkTeam} variant="primary" size="sm">
                    RETRY
                  </PixelButton>
                  <PixelButton onClick={logout} variant="ghost" size="sm">
                    LOGOUT SESSION
                  </PixelButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
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
          <h2 className="font-pixel text-2xl sm:text-3xl text-ink2 mb-2">YOUR TEAM</h2>
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
              <div className="absolute top-4 right-4 text-xs font-bold text-teal/10 group-hover:text-teal/30 pointer-events-none text-4xl font-pixel">
                0{i + 1}
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

                {m.id_document && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-muted">ID Document</span>
                    <a
                      href={m.id_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal hover:underline font-bold flex items-center gap-1"
                    >
                      View ID ↗
                    </a>
                  </div>
                )}
                {m.nu_id_document && (
                  <div className="flex justify-between items-center py-1 border-t border-line/30">
                    <span className="text-xs text-muted">NU ID Document</span>
                    <a
                      href={m.nu_id_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal hover:underline font-bold flex items-center gap-1"
                    >
                      View NU ID ↗
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
  fieldErrors,
  onSubmit,
  onLogout,
  onCancel,
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
              id_document: fieldErrors["member0_id_document"],
              nu_id_document: fieldErrors["member0_nu_id_document"],
            }}
            isEditing={isEditing}
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
              id_document: fieldErrors["member1_id_document"],
              nu_id_document: fieldErrors["member1_nu_id_document"],
            }}
            isEditing={isEditing}
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

function MemberForm({
  value,
  onChange,
  errors,
  isEditing,
}: {
  value: MemberDraft;
  onChange: (v: MemberDraft) => void;
  errors: Record<string, string | undefined>;
  isEditing?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <Field label="Full Name" error={errors.name}>
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="input-modern"
          placeholder="e.g. Omar Ahmed"
        />
      </Field>

      <Field label="Email Address" error={errors.email}>
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="input-modern"
          placeholder="name@example.com"
          type="email"
        />
      </Field>

      <Field label="Phone number" error={errors.phone_number}>
        <input
          value={value.phone_number}
          onChange={(e) => onChange({ ...value, phone_number: e.target.value })}
          className="input-modern"
          placeholder="+20 1xx xxx xxxx"
        />
      </Field>

      <Field label="Nationality" error={errors.nationality}>
        <select
          value={value.nationality}
          onChange={(e) => onChange({ ...value, nationality: e.target.value })}
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
          className="input-modern"
          placeholder="e.g. Computer Science"
        />
      </Field>

      <Field label="Year of Study" error={errors.year_of_study}>
        <select
          value={value.year_of_study}
          onChange={(e) => onChange({ ...value, year_of_study: e.target.value })}
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
            className="input-modern"
            placeholder="Official university name"
          />
        </Field>
      )}

      <Field label="National ID / Passport" error={errors.national_id}>
        <input
          value={value.national_id}
          onChange={(e) => onChange({ ...value, national_id: e.target.value })}
          className="input-modern"
          placeholder={value.nationality === "EG" ? "14-digit ID" : "Passport number"}
        />
      </Field>

      <Field label="Date of Birth (1999–2009)" error={errors.birth_date}>
        <input
          type="date"
          value={value.birth_date}
          onChange={(e) => onChange({ ...value, birth_date: e.target.value })}
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
              onChange={(e) => onChange({ ...value, nu_id: e.target.value })}
              className="input-modern"
              placeholder="e.g. 202100xxx"
            />
          </Field>

          <Field label="NU ID Document" error={errors.nu_id_document}>
            <div className="relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => onChange({ ...value, nu_id_document: e.target.files?.[0] || null })}
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

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-pixel text-muted uppercase tracking-wider ml-1">{label}</span>
        {children}
      </label>
      {error && (
        <span className="text-[10px] font-pixel text-red ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
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
      <span className={`text-muted shrink-0 ${compact ? "text-[10px] font-pixel" : "text-[10px] font-pixel uppercase tracking-wide"}`}>{label}</span>
      <span className={`text-ink truncate ${large ? "text-lg sm:text-xl font-pixel" : "text-sm font-pixel uppercase"} ${highlight ? "text-teal font-bold" : ""} ${compact ? "text-right ml-2" : ""}`}>
        {value}
      </span>
    </div>
  );
}
