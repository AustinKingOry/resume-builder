import type { User, Session, AuthError } from "@supabase/supabase-js"

export type ResumeTemplate = {
    id: string
    name: string
    description: string
    layout:
      | "two-column"
      | "single-column"
      | "modern"
      | "sidebar"
      | "minimal"
      | "dark"
      | "bold"
      | "classic"
      | "elegant"
      | "modern-dark"
      | "technical"
      | "executive"
      | "creative"
      | "functional"
      | "simple"
      | "highlight"
      | "business"
      | "plain"
    thumbnail: string
}
  
export type ColorTheme = {
    id: string
    primary: string
    secondary: string
    accent: string
}
  
export type SkillLevel = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  photo: string
  gender: string
  socialMedia: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}
  
export type ResumeData = {
    selectedTemplate: ResumeTemplate["id"]
    personalInfo: PersonalInfo
    summary: string
    experience: {
      title: string
      company: string
      startDate: string
      endDate: string
      location: string
      description: string
      current: boolean
    }[]
    education: {
      degree: string
      school: string
      startDate: string
      endDate: string
      location: string
      description: string
    }[]
    skills: string[]
    skillLevels: {
      [skill: string]: SkillLevel
    }
    certifications: {
      name: string
      issuer: string
      date: string
      expiry: string
      id: string
    }[]
    referees: {
      name: string
      position: string
      company: string
      email: string
      phone: string
    }[]
}

export interface ResumeDataDb {
	data: ResumeData
	id: string
	user_id: string
  title: string
	template_id: string
  downloads: number
  status: ResumeStatus
  thumbnail?: string
  fileSize?: string
	created_at?: Date
	updated_at?: Date
}

export type ResumeStatus = "draft" | "complete" | "needs-review"  

export interface UserDataCP {
  headline: string
  subheadline: string
  company: string
  profileImage: string
  name?: string
}

export interface TemplateCP {
  id: string
  name: string
  previewBg?: string
}

export interface ColorPaletteCP {
  id: string
  name: string
  colors: string[] // [primary, secondary, accent, background, text]
}

export interface PlatformCP {
  id: string
  name: string
  width: number
  height: number
  description: string
}

// User profile type
export type Profile = {
	id: string
	full_name: string
	username: string
	email: string
  profession: string
	summary?: string
	avatar?: string
	role?: string
  plan: "free" | "hustler" | "pro"
  plan_expires_at: string | null
	created_at: string
	updated_at?: string
}

// Auth context type
export type AuthContextType = {
	user: User | null
	session: Session | null
	profile: Profile | null
	isLoading: boolean
	isProfileLoading: boolean
	signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
	signInWithGoogle: () => Promise<void>
	signUp: (email: string, password: string, userData: unknown) => Promise<{
    error: AuthError | null;
    user: User | null;
    } | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: any;
        user: null;
    }>
	signOut: () => Promise<void>
	resetPassword: (email: string) => Promise<{ error: unknown }>
	updatePassword: (password: string) => Promise<{ error: unknown }>
	updateProfile: (profile: Partial<Profile>) => Promise<{ error: unknown }>
  getCurrentProfile: () => Promise<{ profile: Profile | null; error: unknown }>
  createProfile: (user_id: string, full_name: string, email: string) => Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
  } | undefined>
}

export interface AIGenerationRequest {
  type: "summary" | "job-description" | "skills" | "accomplishments"
  context: {
    jobTitle?: string
    company?: string
    industry?: string
    experience?: string
    skills?: string[]
    personalInfo?: Partial<PersonalInfo>
  }
}

export interface MpesaCallbackResponse {
  status: "checking" | "pending" | "completed" | "failed" | "cancelled"
  amount: number
  mpesaReceiptNumber: string
  phoneNumber: string
  checkoutRequestId: string
  resultCode: string
  resultDesc: string
  transactionDate: Date
}
  
export interface SavedPaymentMethod {
  id: string
  isDefault: boolean
  type: PaymentMethod
  lastFour?: string
  expiryDate?: string
  cardBrand?: string
  cardNumber?: string
  cardName?: string
  cvv?: string
}
export interface PaymentInfo {
  paymentMethod: PaymentMethod
  cardNumber?: string
  cardName?: string
  expiryDate?: string
  cvv?: string
  savePaymentInfo?: boolean
  mpesaNumber?: string
  paymentConfirmed?: boolean
}

export type PaymentMethod = "credit-card" | "mpesa" | "airtel" | "paypal"  

export interface FormErrors {
  [key: string]: string
}
export interface PaymentFormProps {
  initialData: Partial<PaymentInfo>
  onSubmit: (data: PaymentInfo) => void
  onBack: () => void
}

export interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ATSAnalysisResult {
  id?: string;
    overallScore: number
    keywordStrength: number
    skillsMatch: number
    atsReady: number
    keywords: {
      matchedKeywords: Array<{ keyword: string; frequency: number; importance: string }>
      missingKeywords: Array<{ keyword: string; importance: string; reason: string }>
      matchPercentage: number
      analysis: string
    }
    skills: {
      matchedSkills: Array<{ skill: string; category: string; proficiency: string; importance: string }>
      missingSkills: Array<{ skill: string; category: string; priority: string; importance: string }>
      matchPercentage: number
      skillGaps: string[]
      analysis: string
    }
    atsCompatibility: {
      atsScore: number
      formatting: { score: number; issues: string[]; suggestions: string[] }
      structure: { score: number; sections: string[]; missingSections: string[] }
      readability: { score: number; issues: string[] }
      analysis: string
    }
    sectionAnalysis: {
      section: string
      strength: number
      feedback: string
    }[]
    recommendations: {
      improvements: Array<{ category: string; title: string; description: string; priority: string; action: string }>
      atsWarnings: Array<{ warning: string; severity: string; suggestion: string }>
      bestPractices: Array<{ practice: string; benefit: string; implementation: string }>
    }
    processingTime?: number
    metadata?: {
      fileName: string
      fileSize: number
      fileType: string
      pageCount?: number
      wordCount: number
    }
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
}