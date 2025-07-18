import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaziKit – Your Complete Career Toolkit",
  description:
    "KaziKit is an all-in-one platform that empowers job seekers and professionals with tools like AI-powered resume builders, cover letter generators, profile photo tools, and more; designed to help you build a standout career presence.",
  keywords: [
    "KaziKit",
    "resume builder",
    "career tools",
    "AI resume",
    "cover letter generator",
    "professional profile",
    "portfolio tools",
    "job market Africa",
    "career development",
    "build your resume",
    "stand out professionally",
  ],
  openGraph: {
    title: "KaziKit – Your Complete Career Toolkit",
    description:
      "Empowering job seekers and professionals with smart tools for building resumes, cover letters, career profiles, and more.",
    url: "https://kazikit.vercel.app",
    siteName: "KaziKit",
    images: [
      {
        url: "https://kazikit.vercel.app/default.jpg",
        width: 1200,
        height: 630,
        alt: "KaziKit – Career Toolkit for African Youth",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KaziKit – Your Complete Career Toolkit",
    description:
      "Build smarter resumes, generate cover letters, track your skills, and shape your professional path with KaziKit.",
    images: ["https://kazikit.vercel.app/default.jpg"],
    creator: "@KaziKit_",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
