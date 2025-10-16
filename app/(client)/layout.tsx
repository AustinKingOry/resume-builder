import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/roast/app-sidebar"
import { cookies } from "next/headers"
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className={`${geistSans.variable} ${geistMono.variable} antialiased flex-1`}>
        {children}
      </main>
    </SidebarProvider>
  )
}
