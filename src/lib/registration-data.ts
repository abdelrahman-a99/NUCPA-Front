export type UniversityChoice = { value: string; label: string };

export const UNIVERSITY_CHOICES: UniversityChoice[] = [
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

export const COUNTRIES = [
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

export const YEAR_CHOICES = [
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHOMORE", label: "Sophomore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR1", label: "Senior 1" },
  { value: "SENIOR2", label: "Senior 2" },
  { value: "TEENS", label: "Teens / High School" },
];

export type MemberDraft = {
  name: string;
  nationality: string;
  email: string;
  phone_number: string;
  university: string;
  major: string;
  year_of_study: string;
  university_other: string;
  national_id: string;
  birth_date: string;
  nu_id: string;
  codeforces_handle?: string;
  vjudge_handle?: string;
  id_document: File | null;
  nu_id_document: File | null;
  existing_id_url?: string;
  existing_nu_id_url?: string;
};

export type TeamDetails = {
  id: number;
  team_name: string;
  member_count?: number;
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
    codeforces_handle?: string;
    vjudge_handle?: string;
    codeforces_info?: {
      handle: string;
      rank: string;
      rating: number;
      profile_url: string;
    } | null;
    vjudge_info?: {
      handle: string;
      profile_url: string;
    } | null;
    id_document?: string;
    nu_id_document?: string;
  }>;
  application_status: "PENDING" | "APPROVED" | "REJECTED";
  online_status: "NOT_ELIGIBLE" | "ELIGIBLE";
  onsite_status: "NOT_QUALIFIED" | "QUALIFIED_PENDING" | "QUALIFIED_PAID";
  rejection_note?: string;
  data_sharing_consent?: boolean;
};
