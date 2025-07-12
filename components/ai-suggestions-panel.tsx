"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Sparkles } from "lucide-react"

interface AISuggestionsPanelProps {
  suggestions: string[]
  onAccept: (suggestion: string) => void
  onReject: () => void
  title: string
  isVisible: boolean
}

export function AISuggestionsPanel({ suggestions, onAccept, onReject, title, isVisible }: AISuggestionsPanelProps) {
  if (!isVisible) return null

  if (suggestions.length === 0) {
    return (
      <Card className="mt-4 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">No suggestions available at this time. Please try again later.</p>
          <Button size="sm" variant="ghost" onClick={onReject} className="mt-2">
            <X className="mr-1 h-4 w-4" />
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-purple-700 dark:text-purple-300">
          <Sparkles className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <p className="text-sm flex-1 mr-3">{suggestion}</p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAccept(suggestion)}
                className="h-8 w-8 p-0 border-green-300 hover:bg-green-50"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <Button size="sm" variant="ghost" onClick={onReject} className="text-gray-500 hover:text-gray-700">
            <X className="mr-1 h-4 w-4" />
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
