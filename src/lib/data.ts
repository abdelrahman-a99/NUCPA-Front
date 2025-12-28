import { Users, User, HeartHandshake } from "lucide-react";

export const STATS = [
  { label: "First Stage", value: "800+", Icon: Users, iconClass: "w-16 h-16" },
  { label: "Finalist", value: "260+", Icon: User, iconClass: "w-16 h-16" },
  { label: "Volunteers", value: "100+", Icon: HeartHandshake, iconClass: "w-16 h-16" },
] as const;

export const CARDS = [
  {
    key: "format",
    title: "WHAT IS THE CONTEST FORMAT AND HOW IS IT JUDGED?",
    body: "NUCPA 2026 is a one-round onsite team contest. Teams are ranked by number of solved problems, then by lowest penalty time. Penalty time is calculated as the minute of the last correct submission + 10 × the number of wrong submissions in all the solved problems before the correct submission.",
    tone: "teal",
  },
  {
    key: "who",
    title: "WHO CAN APPLY?",
    body: "Anyone can apply, regardless of country or institution. Participants must be up to 25 years old and compete in teams of 2. The contest is open to students and non-students alike, with participants limited to 300 teams. However, NUCPA and NU ICPC do not sponsor or support Visa procedures for participants who are not permitted to enter Egypt.",
    tone: "teal2",
  },
  {
    key: "prizes",
    title: "WHAT ARE THE PRIZES?",
    body: "A 30,000 EGP prize pool for the top 5 teams, gifts for the next 5 teams, and special awards for NU teams (all team must be from NU) and teen teams (all members must be 18 years old or younger by February 1st 2026).",
    tone: "teal2",
  },
  {
    key: "fees",
    title: "HOW CAN WE REGISTER AND WHAT ARE THE FEES?",
    body: "Register through the official link. The participation fee is 300 EGP per team to confirm attendance, with optional merchandise available (T-shirt: 250 EGP, Hoodie: 350 EGP). Teams are first validated, assigned a unique ID, and sent a payment link via Fawry on our website for their chosen package. Payment must be completed within one week to confirm registration. Only the first 300 teams will be accepted, and payments are non-refundable.",
    tone: "teal2",
  },
  {
    key: "changes",
    title: "CAN TEAMS BE CHANGED AFTER REGISTRATION?",
    body: "You can edit or cancel your team using the edit button on our website; however, teams cannot be changed once payment is confirmed, and as stated, payments are non-refundable.",
    tone: "teal2",
  },
  {
    key: "where",
    title: "WHERE WILL THE CONTEST BE HELD?",
    body: "The contest will be held onsite at Nile University’s Campus, 26th of July Corridor, First Al Sheikh Zayed, Giza Governorate, Egypt, in fully equipped labs and halls.",
    tone: "teal2",
  },
  {
    key: "languages",
    title: "WHAT PROGRAMMING LANGUAGES ARE ALLOWED?",
    body: "Participants can use C++, Python, or Java during the contest.",
    tone: "teal2",
  },
  {
    key: "materials",
    title: "MATERIALS & INTERNET ACCESS",
    body: "Only hard copy papers are allowed; these must be brought to the practice session and left until contest time. No electronic devices are permitted. Internet access is restricted to allowed documentation websites and the contest platform only.",
    tone: "teal2",
  },
  {
    key: "agenda",
    title: "WHAT IS THE CONTEST DAY AGENDA?",
    body: "The day will start with an opening and welcome session, followed by a short practice period that is mandatory to attend where teams can test the PCs and laptops. We will then have a Friday prayer break, after which the main contest begins. The day concludes with a closing session and awards ceremony.",
    tone: "teal2",
  },
  {
    key: "certificates",
    title: "ARE THERE CERTIFICATES FOR PARTICIPANTS?",
    body: "Yes, online certificates will be provided. For support, send an email or contact our official page.",
    tone: "teal2",
  },
  {
    key: "volunteer",
    title: "CAN I VOLUNTEER FOR THE CONTEST?",
    body: "Yes! Anyone can volunteer to help run the contest. Roles may include registration, lab setup, assisting teams during practice, monitoring the contest, and supporting the awards ceremony. To apply, simply follow our official page and wait for the volunteer registration announcement. Volunteers will receive certificates and special perks during the contest.",
    tone: "teal2",
  },
] as const;

export const TIMELINE_ITEMS = [
  { title: "Applications Open", date: "December 24th, 2025" },
  { title: "Applications Close", date: "December 27th, 2025" },
  { title: "Payment Deadline", date: "December 28th, 2025" },
  { title: "Competition Day", date: "December 29th, 2025" },
] as const;

export const AWARD_TABS = [
  { key: "top10", label: "Top 10 Overall Teams" },
  { key: "nu", label: "NU Student Awards" },
  { key: "hs", label: "High School Awards" },
  { key: "first", label: "First Solve Awards" },
] as const;

export const PRIZES = {
  top10: [
    {
      title: "1st PLACE PRIZE:",
      caption: "Trophy Cup + 10k EGP",
      images: ["/assets/trophy.png", "/assets/MEDAL_GOLD.png"],
    },
    {
      title: "2nd PLACE PRIZE:",
      caption: "7.5k EGP",
      images: ["/assets/MEDAL_GOLD.png", "/assets/gift.png"],
    },
    {
      title: "3rd PLACE PRIZE:",
      caption: "5.5k EGP",
      images: ["/assets/MEDAL_GOLD.png", "/assets/gift.png"],
    },
    {
      title: "4th PLACE PRIZE:",
      caption: "4k EGP",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "5th PLACE PRIZE:",
      caption: "3k EGP",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "6th - 10th PLACE:",
      caption: "2 Gifts",
      images: ["/assets/MEDAL_BRONZE.png", "/assets/gift.png"],
    },
  ],
  nu: [
    {
      title: "1st PLACE (NU):",
      caption: "Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
    {
      title: "2nd PLACE (NU):",
      caption: "Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
    {
      title: "3rd PLACE (NU):",
      caption: "Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
  ],
  hs: [
    {
      title: "1st PLACE (HS):",
      caption: "Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
    {
      title: "2nd PLACE (HS):",
      caption: "Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
  ],
  first: [
    {
      title: "FIRST TO SOLVE:",
      caption: "One Certificate per Problem",
      images: ["/assets/certificate.png"],
    },
  ],
} as const;

export const ABOUT_GALLERY = [
  "/assets/about-gallery/1.jpg",
  "/assets/about-gallery/2.jpg",
  "/assets/about-gallery/3.jpg",
  "/assets/about-gallery/4.jpg",
  "/assets/about-gallery/5.jpg",
  "/assets/about-gallery/6.jpg",
  "/assets/about-gallery/7.jpg",
  "/assets/about-gallery/8.jpg",
  "/assets/about-gallery/9.jpg",
  "/assets/about-gallery/10.jpg",
  "/assets/about-gallery/11.jpg",
  "/assets/about-gallery/12.jpg",
  "/assets/about-gallery/13.jpg",
];
