import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://safesnack.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SafeSnack — Guilt-Free Snacks, Delivered Fast",
    template: "%s · SafeSnack",
  },
  description:
    "Sugar-free, diabetic-friendly, keto-compatible snacks. Nutritionist-approved treats delivered across Hyderabad.",
  openGraph: {
    title: "SafeSnack — Guilt-Free Snacks, Delivered Fast",
    description: "Sugar-free, diabetic-friendly snacks delivered across Hyderabad.",
    url: SITE_URL,
    siteName: "SafeSnack",
    type: "website",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SafeSnack",
  url: SITE_URL,
  email: "safesnack1@gmail.com",
  description: "Sugar-free, diabetic-friendly, keto-compatible snacks delivered across Hyderabad.",
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
