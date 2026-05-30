import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://designvibe.vercel.app";

export const metadata: Metadata = {
  title: "DesignVibe - AI-Powered Design Canvas",
  description: "Transform images into editable design layers using AI-powered analysis. Automatically detect text, shapes, and colors.",
  keywords: ["design", "ai", "canvas", "image analysis", "design tool"],
  authors: [{ name: "DesignVibe" }],
  creator: "DesignVibe",
  publisher: "DesignVibe",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "DesignVibe - AI-Powered Design Canvas",
    description: "Transform images into editable design layers using AI-powered analysis.",
    siteName: "DesignVibe",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "DesignVibe - AI-Powered Design Canvas",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "DesignVibe - AI-Powered Design Canvas",
    description: "Transform images into editable design layers using AI-powered analysis.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@designvibe",
  },

  // Verification and other tags
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // Canonical URL
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-neutral-950`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-50">{children}</body>
    </html>
  );
}
