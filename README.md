# NUCPA Frontend 🎮

> The official frontend for the **Nile University Competitive Programming Arena (NUCPA)** — a Next.js web app featuring a pixel-art themed landing page, team registration portal, attendance confirmation flow, and admin dashboard.

---

## ✨ Key Features

### Landing Page
- **Pixel-art aesthetic** across headings and buttons.
- **Hero section** with animated countdown timer to the event date.
- **About section** with auto-playing image gallery.
- **Details section** with event information and stats.
- **Timeline** of contest phases.
- **Awards section** with tabbed prize categories.
- **Contact Us** form with email submission.
- **Responsive design** — optimized for mobile, tablet, and desktop.
- **SEO optimized** with configured metadata for social sharing.

### Registration Portal (`/registration`)
- **Google OAuth** login with popup-based flow.
- **Multi-step registration form** with real-time field validation.
- **Member forms** — two members per team, with fields for personal info, university, Codeforces/VJudge handles, and document uploads.
- **Team dashboard** — view and edit registration, track approval status.
- **Rules modal** with competition guidelines.
- **Attendance confirmation** — qualified teams can confirm or decline onsite participation.
- **Registration closed** page — gracefully blocks new signups when admin disables registration, while still allowing existing teams to view their dashboard.

### Admin Dashboard (`/nucpa-secret-admin`)
- **Protected admin login** with staff-only access verification.
- **Team management** — view all registered teams with filtering, sorting, and search.
- **Status management** — approve/reject teams, update online/onsite qualification status.
- **Codeforces stats** — visualize CF rating distribution with charts (Recharts).
- **CSV export** — download team data with optional filters.
- **Toggle controls** — open/close registration and attendance confirmation.
- **Document viewer** — securely view uploaded ID documents.

### Architecture
- **Next.js API proxy routes** — all backend requests are proxied through Next.js server routes for secure token handling (tokens stored in HTTP-only cookies, never exposed to the browser).
- **Custom hooks** — `useRegistration`, `useGoogleLogin`, `useAdmin` encapsulate all business logic.
- **Maintenance wrapper** — global component that checks registration status and redirects accordingly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) + `tailwind-merge` + `clsx` |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | Custom Pixel Font + Geist Sans/Mono |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/abdelrahman-a99/NUCPA-Front.git
cd NUCPA-Front

npm install
```

### Environment Variables

Create `.env.local` (or set in Vercel):

```env
# Used by browser popup (Google login redirect)
NEXT_PUBLIC_NUCPA_API_BASE_URL=http://127.0.0.1:8000

# Used by Next.js API routes (server-side proxy to backend)
NUCPA_API_BASE_URL=http://127.0.0.1:8000
```

### Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Landing page (Home)
│   ├── layout.tsx                 # Root layout + metadata
│   ├── globals.css                # Global styles
│   ├── registration/              # Registration page
│   ├── registration-closed/       # Closed registration page
│   ├── auth/                      # Auth callback handling
│   ├── nucpa-secret-admin/        # Admin portal
│   │   ├── login/                 # Admin login page
│   │   └── dashboard/             # Admin dashboard
│   └── api/                       # Next.js API proxy routes
│       ├── auth/                  # Login, logout, token storage
│       └── registration/          # Teams, members, documents, CSV, stats
├── components/
│   ├── layout/                    # Navbar, Footer
│   ├── sections/                  # Landing page sections
│   │   ├── Hero.tsx               # Hero + countdown timer
│   │   ├── About.tsx              # About + image gallery
│   │   ├── Details.tsx            # Event details + stats
│   │   ├── Timeline.tsx           # Contest timeline
│   │   ├── Awards.tsx             # Prize categories (tabbed)
│   │   └── Contact.tsx            # Contact form
│   ├── registration/              # Registration flow components
│   │   ├── RegistrationForm.tsx   # Main registration wizard
│   │   ├── MemberForm.tsx         # Individual member form
│   │   ├── TeamView.tsx           # Team dashboard / status
│   │   ├── AttendanceConfirmation.tsx
│   │   ├── RulesModal.tsx
│   │   ├── HandleBadge.tsx        # CF/VJudge handle display
│   │   ├── Field.tsx              # Form field wrapper
│   │   └── InfoRow.tsx            # Info display row
│   ├── ui/                        # Reusable UI (PixelButton, SectionHeader)
│   └── MaintenanceWrapper.tsx     # Registration status gate
├── hooks/
│   ├── useRegistration.ts         # Team registration logic
│   ├── useGoogleLogin.ts          # OAuth popup flow
│   └── useAdmin.ts                # Admin dashboard logic
├── lib/
│   ├── data.ts                    # Landing page content (stats, prizes, timeline)
│   ├── site.ts                    # Nav items, event date constant
│   ├── registration-data.ts       # University list, form constants
│   ├── phone-data.ts              # Country phone codes
│   └── cn.ts                      # Class name merge utility
├── utils/                         # Misc utilities
└── public/
    └── assets/                    # Static images (logo, gallery, sponsors)
```

---

## 🎨 Customization

| What | Where |
|------|-------|
| Landing page text & data | `src/lib/data.ts` |
| Event date | `src/lib/site.ts` → `EVENT_DATE_ISO` |
| Navigation items | `src/lib/site.ts` → `NAV_ITEMS` |
| University list | `src/lib/registration-data.ts` |
| Colors & theme | `tailwind.config.ts` |
| Images & assets | `public/assets/` |

---

## 🌍 Deployment

Optimized for **Vercel**:

1. Connect your GitHub repo to Vercel.
2. Set environment variables (`NEXT_PUBLIC_NUCPA_API_BASE_URL`, `NUCPA_API_BASE_URL`).
3. Deploy — Vercel handles build & hosting automatically.

For other platforms, run:

```bash
npm run build
npm start
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
