import { Users, User, HeartHandshake } from "lucide-react";

export const STATS = [
  { label: "First Stage", value: "800+", Icon: Users, iconClass: "w-16 h-16" },
  { label: "Finalist", value: "260+", Icon: User, iconClass: "w-16 h-16" },
  { label: "Volunteers", value: "100+", Icon: HeartHandshake, iconClass: "w-16 h-16" },
] as const;

export const CARDS = [
  {
    key: "format",
    title: "CONTEST FORMAT & JUDGING",
    body: "NUCPA 2026 is held in two stages. The online qualification round takes place on Saturday, February 14th, 2026, and is free to participate. Ranking follows ICPC-style rules; teams are ranked by the number of solved problems, then by penalty time (the total summation of the minutes of accepted submissions plus 20 minutes for each wrong attempt before acceptance). Qualified teams advance to the onsite final round on Friday, April 17th, 2026, which follows the same judging rules.",
    tone: "teal",
  },
  {
    key: "eligibility",
    title: "ELIGIBILITY & TEAM REQUIREMENTS",
    body: "The contest is open to everyone, regardless of country or institution. Participants must be 25 years old or younger and compete in teams of two. Both students and non-students are welcome. International teams may participate, but NUCPA and NU ICPC do not provide visa sponsorship or assistance for entry into Egypt.",
    tone: "teal2",
  },
  {
    key: "prizes",
    title: "ONSITE CONTEST PRIZES & SPECIAL AWARDS",
    body: "NUCPA 2026 offers a 30,000 EGP prize pool awarded to the top 5 teams, along with gifts for the next 5 teams. Additional special awards are dedicated to Nile University teams (all members from NU) and Teen teams, where all members are 18 years old or younger by February 1st, 2026.",
    tone: "teal2",
  },
  {
    key: "registration",
    title: "REGISTRATION, FEES & MERCHANDISE",
    body: "Registration closes on Tuesday, February 10th, 2026, via the official link. The online round is completely free for all registered teams. The onsite final round requires a minimal non-refundable participation fee per team to ensure seriousness; payment details will be shared after qualification. T-shirts and merchandise will be available for purchase after Stage 1.",
    tone: "teal2",
  },
  {
    key: "changes",
    title: "TEAM CHANGES POLICY",
    body: "Before the registration deadline, teams can be edited or canceled through the website. After a team is verified, edits are no longer allowed; any changes require canceling the team and submitting a new application (before the deadline). Once the online round begins, no team edits or cancellations will be permitted under any circumstances.",
    tone: "teal2",
  },
  {
    key: "location",
    title: "CONTEST TIME & LOCATION",
    body: "The online qualification round will be held remotely on February 14, 2026, at 8:35 PM. The onsite final round will take place on Friday, April 17, 2026, at Nile University Campus, 26th of July Corridor, First Al Sheikh Zayed, Giza Governorate, Egypt. The event runs all day from 9:00 AM to 9:00 PM in fully equipped labs and halls.",
    tone: "teal2",
  },
  {
    key: "languages",
    title: "ALLOWED PROGRAMMING LANGUAGES",
    body: "Participants may use C++, Python, or Java in both the online and onsite rounds.",
    tone: "teal2",
  },
  {
    key: "materials",
    title: "ONSITE MATERIALS & INTERNET RULES",
    body: "During the onsite round, only hard-copy papers are allowed; these must be brought to the practice session and left until contest time. Electronic devices are prohibited, and internet access is limited strictly to the contest platform and approved documentation websites.",
    tone: "teal2",
  },
  {
    key: "schedule",
    title: "ONSITE CONTEST DAY SCHEDULE",
    body: "The day begins with an opening and welcome session, followed by a mandatory practice period to test the systems. After a Friday prayer break, the main contest takes place, and the day concludes with a closing session and awards ceremony.",
    tone: "teal2",
  },
  {
    key: "certificates",
    title: "CERTIFICATES",
    body: "All participants will receive online certificates. For any inquiries or support, participants can contact the organizing team via email or through the official NUCPA pages.",
    tone: "teal2",
  },
  {
    key: "volunteering",
    title: "VOLUNTEERING OPPORTUNITIES",
    body: "Volunteering is open to everyone. Volunteers may assist with registration, lab setup, team support, contest monitoring, and the awards ceremony. To apply, follow the official page and wait for the volunteer registration announcement. Volunteers receive certificates and special perks.",
    tone: "teal2",
  },
] as const;

export const TIMELINE_ITEMS = [
  { title: "Applications Open", date: "January 14th, 2026" },
  { title: "Applications Close", date: "February 10th, 2026" },
  { title: "First Stage (Online)", date: "February 14th, 2026" },
  { title: "Qualified Teams", date: "February 25th, 2026" },
  { title: "Payment Deadline", date: "April 1st, 2026" },
  { title: "Final Stage (Offline)", date: "April 17th, 2026" },
] as const;

export const AWARD_TABS = [
  { key: "top10", label: "Top 10 Teams" },
  { key: "nu", label: "NU Student Awards" },
  { key: "hs", label: "High School Awards" },
  { key: "first", label: "First Solve Awards" },
] as const;

export const PRIZES = {
  top10: [
    {
      title: "1st Place:",
      caption: "Championship and 10,000 EGP Cash Prize",
      images: ["/assets/trophy.png", "/assets/MEDAL_GOLD.png"],
    },
    {
      title: "2nd Place:",
      caption: "7,500 EGP Cash Prize",
      images: ["/assets/MEDAL_GOLD.png", "/assets/gift.png"],
    },
    {
      title: "3rd Place:",
      caption: "5,500 EGP Cash Prize",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "4th Place:",
      caption: "4,000 EGP Cash Prize",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "5th Place:",
      caption: "3,000 EGP Cash Prize",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "6th - 10th Place:",
      caption: "Gift",
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
  "/assets/about-gallery/3.jpeg",
  "/assets/about-gallery/4.jpg",
  "/assets/about-gallery/5.jpg",
  "/assets/about-gallery/6.jpg",
  "/assets/about-gallery/7.jpg",
  "/assets/about-gallery/8.jpg",
  "/assets/about-gallery/9.jpg",
  "/assets/about-gallery/10.jpg",
  "/assets/about-gallery/11.jpg",
];

export const SPONSORS = [
  "/assets/sponsers/Hayat.png",
  "/assets/sponsers/IECC NUCPA Partner.png",
  "/assets/sponsers/Infinity code.png",
  "/assets/sponsers/Kimit Academy.png",
  "/assets/sponsers/Lapboost.png",
  "/assets/sponsers/Manara.png",
  "/assets/sponsers/Oat Choco.png",
  "/assets/sponsers/YES!.png",
];
