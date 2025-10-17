import { SidebarProvider, 
  SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/client/app-sidebar"
import { cookies } from "next/headers"
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ClientHeader from "@/components/layout/client/header";

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
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
      <main className={`${geistSans.variable} ${geistMono.variable} antialiased flex-1`}>
        <ClientHeader />
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
