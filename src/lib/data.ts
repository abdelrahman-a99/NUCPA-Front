import { Users, User, HeartHandshake } from "lucide-react";

export const STATS = [
  { label: "First Stage", value: "800+", Icon: Users, iconClass: "w-16 h-16" },
  { label: "Finalist", value: "260+", Icon: User, iconClass: "w-16 h-16" },
  { label: "Volunteers", value: "100+", Icon: HeartHandshake, iconClass: "w-16 h-16" },
] as const;

export const CARDS = [
  {
    key: "what",
    title: "WHAT IS THE CONTEST FORMAT AND HOW IS IT JUDGED?",
    body: "NUCPA is a one-round onsite team contest. Teams are ranked by number of solved problems, then by lowest penalty time. Penalty time is calculated as the minute of the last correct submission + 10 × the number of wrong submissions in all the solved problems before the correct submission.",
    tone: "teal",
  },
  {
    key: "who",
    title: "WHO CAN APPLY?",
    body: "Any one can apply, regardless of country or institution. Participants must be up to 25 years old and compete in teams of two. The contest is open to students and non-students alike, with participants limited to 300 teams. However, NUCPA and NU ICPC do not sponsor or support Visa procedures for participants who are not permitted to enter Egypt.",
    tone: "teal2",
  },
  {
    key: "where",
    title: "WHERE WILL THE CONTEST BE HELD?",
    body: "The contest will be held onsite at Nile University's Campus, Giza, Egypt, in fully equipped labs and halls. Seats are confirmed after registration and payment. You don't have to bring your own laptop at all.",
    tone: "teal2",
  },
  {
    key: "fees",
    title: "HOW CAN WE REGISTER AND WHAT ARE THE FEES?",
    body: "Register through the official link. The participation fee is 300 EGP per team, a nominal fee required only to confirm your attendance. Optional merchandise is available, including a T-shirt (250 EGP) and a hoodie (350 EGP).",
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
      caption: "Trophy Cup + Gold Medal + 10k EGP",
      images: ["/assets/trophy.png", "/assets/MEDAL_GOLD.png"],
    },
    {
      title: "2nd PLACE PRIZE:",
      caption: "Gold Medal + 7.5k EGP",
      images: ["/assets/MEDAL_GOLD.png", "/assets/gift.png"],
    },
    {
      title: "3rd PLACE PRIZE:",
      caption: "Gold Medal + 5.5k EGP",
      images: ["/assets/MEDAL_GOLD.png", "/assets/gift.png"],
    },
    {
      title: "4th PLACE PRIZE:",
      caption: "Silver Medal + 4k EGP",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "5th PLACE PRIZE:",
      caption: "Silver Medal + 3k EGP",
      images: ["/assets/MEDAL_SILVER.png", "/assets/gift.png"],
    },
    {
      title: "6th - 10th PLACE:",
      caption: "Bronze Medal + 2 Gifts",
      images: ["/assets/MEDAL_BRONZE.png", "/assets/gift.png"],
    },
  ],
  nu: [
    {
      title: "1st PLACE (NU):",
      caption: "Shield + Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
    {
      title: "2nd PLACE (NU):",
      caption: "Shield + Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
    {
      title: "3rd PLACE (NU):",
      caption: "Shield + Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
  ],
  hs: [
    {
      title: "1st PLACE (HS):",
      caption: "Shield + Gift",
      images: ["/assets/trophy.png", "/assets/gift.png"],
    },
    {
      title: "2nd PLACE (HS):",
      caption: "Shield + Gift",
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
