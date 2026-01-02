# NUCPA Landing Page

This repository contains the front-end code for the **Nile University Competitive Programming Arena (NUCPA)** landing page. It is built with **Next.js**, **Tailwind CSS**, and **TypeScript**.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abdelrahman-a99/NUCPA-Front.git
    cd nucpa-front
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

#### Environment variables

Create `.env.local` (or set these in Vercel):

```bash
NEXT_PUBLIC_NUCPA_API_BASE_URL=
NUCPA_API_BASE_URL=
```

The browser uses `NEXT_PUBLIC_NUCPA_API_BASE_URL` for the Google-login popup, while Next.js server routes use `NUCPA_API_BASE_URL` to proxy requests securely.

4.  **Open the site:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technologies Used

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + `tailwind-merge`
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Language:** TypeScript
-   **Fonts:** Custom Pixel Font + Geist Sans/Mono

## 📂 Project Structure

-   `src/app`: App directory containing pages and layouts.
-   `src/components`:
    -   `layout`: Navbar, Footer.
    -   `sections`: Individual landing page sections (Hero, About, Details, Timeline, Awards, Contact).
    -   `ui`: Reusable UI components (PixelButton, SectionHeader).
-   `src/lib`:
    -   `data.ts`: Centralized content data (Stats, Prizes, Timeline items, Gallery paths).
    -   `site.ts`: Site configuration constants (Nav items, Event date).
    -   `cn.ts`: Utility for merging class names.
-   `public/assets`: Static images and assets (including the About Gallery).

## ✨ Key Features

-   **Pixel Art Theme:** Consistent pixel-art aesthetic across buttons and headings.
-   **Countdown Timer:** Real-time countdown to the event date.
-   **Image Gallery:** Auto-playing slider in the About section.
-   **Dynamic Awards Section:** Tabbed interface for viewing prizes by category.
-   **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
-   **SEO Optimized:** configured metadata for social sharing.

## 📝 Customization

-   **Content:** Edit text and dynamic data in `src/lib/data.ts`.
-   **Images:** Add or replace images in `public/assets`.
-   **Colors:** Modify the color palette in `tailwind.config.ts`.
