"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIAssistantButtonProps {
  onGenerate: () => Promise<void>
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
  children?: React.ReactNode
}

export function AIAssistantButton({
  onGenerate,
  className,
  size = "sm",
  variant = "outline",
  children,
}: AIAssistantButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await onGenerate()
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleGenerate}
      disabled={isGenerating}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
        "text-white border-0 shadow-md hover:shadow-lg",
        className,
      )}
    >
      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      {children || (isGenerating ? "Generating..." : "AI Assist")}
    </Button>
  )
}
