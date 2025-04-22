"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PlatformCP } from "@/lib/types"

interface PlatformSelectorProps {
  platforms: PlatformCP[]
  selectedPlatform: PlatformCP
  onSelect: (platform: PlatformCP) => void
}

export default function PlatformSelector({ platforms, selectedPlatform, onSelect }: PlatformSelectorProps) {
  return (
    <div className="w-full sm:w-[260px]">
      <Select
        value={selectedPlatform.id}
        onValueChange={(value) => {
          const platform = platforms.find((p) => p.id === value)
          if (platform) onSelect(platform)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map((platform) => (
            <SelectItem key={platform.id} value={platform.id} className="flex items-center">
              <div>
                <div className="font-medium">{platform.name}</div>
                <div className="text-xs text-muted-foreground">
                  {platform.width}×{platform.height}px
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

