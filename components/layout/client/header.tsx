"use client"

import { useAuth } from '@/components/auth-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { User, Zap } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { supabaseUsageService } from "@/lib/supabase/client/usage-service"
import { ThemeSwitcher } from '@/components/theme-switcher'

const ClientHeader = () => {
  const [usage, setUsage] = useState({ count: 0, limit: 5, plan: "free" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, profile: userProfile, isLoading: authLoading } = useAuth()
  
    useEffect(() => {
      const updateUsage = async () => {
        if (user) {
          const currentUsage = await supabaseUsageService.getCurrentUsage()
          setUsage(currentUsage)
        }
      }
  
      if (user) {
        updateUsage()
        const interval = setInterval(updateUsage, 60000) // Update every minute
        return () => clearInterval(interval)
      }
    }, [user])
  return (
    <header className="border-b px-6 xl:px-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">                    
                    <SidebarTrigger />
                    <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center text-white font-bold">
                        K
                    </div>
                    <span className="text-lg font-semibold">Kazikit</span>
                    </Link>
                </div>

                {/* <nav className="hidden md:flex items-center gap-6">
                <Link href="/resumes" className="text-sm font-medium">
                    My Resumes
                </Link>
                <Link href="/cover-letters" className="text-sm text-muted-foreground hover:text-foreground">
                    Cover Letters
                </Link>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
                    Profile
                </Link>
                </nav> */}

                <div className="flex items-center gap-2">
                
                <div className="flex items-center gap-4">
                        {user ? (
                        <>
                        <Badge
                            variant="outline"
                            className={`${
                            usage.plan === "free"
                                ? "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
                                : usage.plan === "hustler"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                                : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                            } max-[425px]:hidden`}
                        >
                            <Zap className="w-3 h-3 mr-1" />
                            {usage.plan === "free" ? "Free Plan" : usage.plan === "hustler" ? "Hustler Plan 💪" : "Pro Plan 👑"}
                        </Badge>
                        </>
                        ) : (
                            <Button variant="outline" className="bg-transparent" asChild>
                            <Link href="/login"><User className="w-4 h-4 mr-2" />Sign In</Link>                            
                            </Button>
                        )}
                        </div>
                <ThemeSwitcher />
                </div>
            </div>
    </header>
  )
}

export default ClientHeader