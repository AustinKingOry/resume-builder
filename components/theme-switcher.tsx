"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { setTheme, theme } = useTheme()

  const isDark = theme === "dark"
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className={cn(
        "rounded-full border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_0_1px_rgba(16,185,129,.15)]",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4 text-emerald-400" /> : <Moon className="h-4 w-4 text-sky-600" />}
    </Button>
  )
}
