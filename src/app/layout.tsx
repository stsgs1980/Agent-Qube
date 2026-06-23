import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
// TODO: restore after @zai/select-element is available
// import { SelectElementFAB } from "@zai/select-element";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent Qube — Multi-Agent System",
  description: "Agent Qube — Multi-Agent System Dashboard with 26 agents across 8 role groups.",
  keywords: ["Agent Qube", "Multi-Agent System", "Agent Hierarchy", "Cognitive Formulas", "Dashboard", "Next.js"],
  authors: [{ name: "Agent Qube Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Agent Qube Dashboard",
    description: "Multi-Agent System Dashboard",
    url: "https://chat.z.ai",
    siteName: "Agent Qube",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Qube Dashboard",
    description: "Multi-Agent System Dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        {/* <SelectElementFAB /> */}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
