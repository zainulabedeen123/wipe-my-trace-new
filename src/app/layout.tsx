import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Wipe My Trace - Automated Data Deletion & Privacy Protection",
  description: "Protect your privacy with automated data deletion requests across multiple jurisdictions. GDPR & CCPA compliant. Remove your personal data from data brokers and companies effortlessly.",
  keywords: "data deletion, privacy protection, GDPR, CCPA, data brokers, personal data removal, privacy rights",
  openGraph: {
    title: "Wipe My Trace - Automated Data Deletion & Privacy Protection",
    description: "Protect your privacy with automated data deletion requests across multiple jurisdictions. GDPR & CCPA compliant.",
    type: "website",
    url: "https://wipemytrace.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wipe My Trace - Automated Data Deletion & Privacy Protection",
    description: "Protect your privacy with automated data deletion requests across multiple jurisdictions. GDPR & CCPA compliant.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
