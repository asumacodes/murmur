import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://murmur.studio"),
  title: "Murmur - Speak. Transcribe. Ship.",
  description:
    "A five-minute voice memo becomes a validated PRD, brand kit, Jira board, Confluence space, and launch foundation.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Murmur - Speak. Transcribe. Ship.",
    description:
      "The agentic pipeline that turns a voice memo into a complete project foundation.",
    url: "https://murmur.studio",
    siteName: "Murmur",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Murmur - Speak. Transcribe. Ship.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Murmur - Speak. Transcribe. Ship.",
    description:
      "The agentic pipeline that turns a voice memo into a complete project foundation.",
    creator: "@AsumaCodes",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
