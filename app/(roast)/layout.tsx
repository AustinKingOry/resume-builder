"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/roast/app-sidebar"
import { cookies } from "next/headers"
import { useAuth } from "@/components/auth-provider";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    const { user, isLoading, profile } = useAuth();
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !user && pathname !== "/login") {
        router.push("/login")
        }
    }, [user, isLoading, router, pathname])

    if (isLoading) {
        return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        )
    }

    if (!user) {
        return null
    }
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar profile={profile} />
      <main className="flex-1">
        {children}
      </main>
    </SidebarProvider>
  )
}
