export type CoverLetterStatus = "draft" | "complete" | "needs-review"

export interface JobDetails {
  company: string
  position: string
  description: string
}

export interface CoverLetter {
  id: string
  title: string
  company: string
  position: string
  jobDescription: string
  content: string
  status: CoverLetterStatus
  createdAt: string
  updatedAt: string
  wordCount: number
  downloads: number
  metadata?: {
    ai_model?: string
    temperature?: number
    tone?: "professional" | "confident" | "friendly" | "enthusiastic"
    version?: string
  }
}

export interface AIRequest {
  action:
    | "generate"
    | "expand"
    | "shorten"
    | "improve"
    | "personalize"
    | "customize-opening"
    | "add-metrics"
    | "highlight-experience"
  content?: string
  jobDescription?: string
  company?: string
  position?: string
  tone?: "professional" | "confident" | "friendly" | "enthusiastic"
  customPrompt?: string
}

export interface AIResponse {
  success: boolean
  content?: string
  suggestions?: string[]
  message?: string
}

export interface CoverLetterEditorProps {
  mode: "view" | "create"
  initialData?: CoverLetter
  onSave?: (data: CoverLetter) => void
  isLoading?: boolean
}
