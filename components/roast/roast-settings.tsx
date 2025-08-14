"use client"

import { Coffee, Flame, Settings, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface RoastSettingsProps {
  roastTone: "light" | "heavy"
  onToneChange: (tone: "light" | "heavy") => void
  showEmojis: boolean
  onEmojiToggle: (show: boolean) => void
  focusAreas: string[]
  onFocusAreasChange: (areas: string[]) => void
}

export function RoastSettings({
  roastTone,
  onToneChange,
  showEmojis,
  onEmojiToggle,
  focusAreas,
  onFocusAreasChange,
}: RoastSettingsProps) {
  const availableFocusAreas = [
    "Format & Design",
    "Content & Writing",
    "Skills & Experience",
    "Contact Info",
    "NGO/UN Applications",
    "Government Jobs",
  ]

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      onFocusAreasChange(focusAreas.filter((a) => a !== area))
    } else {
      onFocusAreasChange([...focusAreas, area])
    }
  }

  return (
    <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-blue-50/30 relative overflow-hidden dark:border-emerald-900 dark:from-emerald-950/50 dark:to-blue-950/30 max-w-[calc(100vw-(0px))]">
      {/* Subtle pattern */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fillOpacity='0.3'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
          <Settings className="w-5 h-5" />
          Roast Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {/* Roast Tone */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block dark:text-gray-100">Roast Intensity 🌶️</Label>
          <div className="flex gap-2 w-full max-[425px]:flex-wrap">
            <Button
              variant={roastTone === "light" ? "default" : "outline"}
              className={`flex-1 max-sm:text-xs ${
                roastTone === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-400 dark:hover:bg-blue-300 dark:text-black"
                  : "border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
              }`}
              onClick={() => onToneChange("light")}
            >
              <Coffee className="w-4 h-4 mr-2" />
              Light Roast ☕
            </Button>
            <Button
              variant={roastTone === "heavy" ? "default" : "outline"}
              className={`flex-1 max-sm:text-xs ${
                roastTone === "heavy"
                  ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-400 dark:hover:bg-red-300 dark:text-black"
                  : "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              }`}
              onClick={() => onToneChange("heavy")}
            >
              <Flame className="w-4 h-4 mr-2" />
              Heavy Roast 🔥
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">
            {roastTone === "light"
              ? "Gentle, encouraging feedback - like advice from your big sister 😊"
              : "Brutally honest, no-holds-barred critique - you'll know exactly where you stand! 💯"}
          </p>
        </div>

        {/* Emoji Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="emoji-toggle" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Include Emojis
            </Label>
            <p className="text-xs text-gray-600 dark:text-gray-400">Add emojis to make feedback more engaging</p>
          </div>
          <Switch id="emoji-toggle" checked={showEmojis} onCheckedChange={onEmojiToggle} />
        </div>

        {/* Focus Areas */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block flex items-center gap-2 dark:text-gray-100">
            <Target className="w-4 h-4" />
            Focus Areas
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableFocusAreas.map((area) => (
              <Badge
                key={area}
                variant={focusAreas.includes(area) ? "default" : "outline"}
                className={`cursor-pointer transition-colors text-xs ${
                  focusAreas.includes(area)
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-black"
                    : "border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-emerald-950 dark:hover:border-emerald-700"
                }`}
                onClick={() => toggleFocusArea(area)}
              >
                {area}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">Select areas you want the AI to focus on during the roast</p>
        </div>
      </CardContent>
    </Card>
  )
}