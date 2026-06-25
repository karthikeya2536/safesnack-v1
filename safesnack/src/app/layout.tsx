import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://safesnack.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SafeSnack | Clean sugar-free snacks in Hyderabad",
    template: "%s · SafeSnack",
  },
  description:
    "Sugar-free, diabetic-friendly, keto-compatible snacks from Hyderabad. Clean ingredients, quick delivery, and nutrition-first treats.",
  openGraph: {
    title: "SafeSnack | Clean sugar-free snacks in Hyderabad",
    description: "Sugar-free, diabetic-friendly snacks from Hyderabad with clean ingredients and quick delivery.",
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
    <html lang="en" className={`${outfit.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <div id="main" className="min-h-[70dvh]">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
