import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NUCPA - Join the Coding Arena",
  description: "Egypt's largest student-led problem-solving competition. Join 300+ teams and compete for glory at Nile University.",
  keywords: ["NUCPA", "Competitive Programming", "Egypt", "Nile University", "Coding Contest", "ICPC"],
  openGraph: {
    title: "NUCPA - Join the Coding Arena",
    description: "Egypt's largest student-led problem-solving competition.",
    url: "https://nucpa.org",
    siteName: "NUCPA",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "NUCPA Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUCPA - Join the Coding Arena",
    description: "Egypt's largest student-led problem-solving competition.",
    images: ["/assets/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
