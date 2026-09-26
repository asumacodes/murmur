import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { brandFontVars } from "@/lib/brand-fonts";
import { organizationSchema, softwareApplicationSchema, websiteSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--ff-display",
  axes: ["wdth", "opsz"],
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--ff-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--ff-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  style: ["italic"],
  weight: "400",
  variable: "--ff-serif",
  display: "swap",
});

const description =
  "Talk through your idea. Murmur researches competitors, writes the PRD, brand kit and tech design, then builds your Jira board and Confluence space in under 10 minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Murmur: Voice Memo to PRD, Brand Kit & Jira Board in 10 Minutes",
    template: "%s · Murmur",
  },
  description,
  applicationName: "Murmur",
  keywords: [
    "voice memo to PRD",
    "AI PRD generator",
    "PRD to Jira",
    "Jira epics from PRD",
    "brand kit generator",
    "technical design document",
    "startup idea to roadmap",
    "Confluence space generator",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Murmur: voice memo in, whole project out",
    description,
    url: SITE_URL,
    siteName: "Murmur",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Murmur: voice memo in, whole project out",
    description,
    site: "@trymurmurhq",
    creator: "@AsumaCodes",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#f3f0e9" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs before first paint so the page never flashes the wrong theme.
 * Stored choice wins; otherwise follow the OS.
 */
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('mm-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t;d.classList.add('js')}catch(e){document.documentElement.dataset.theme='dark'}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} ${serif.variable} ${brandFontVars}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema, softwareApplicationSchema]),
          }}
        />
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
