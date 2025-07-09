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
    thumbnail: string
  }
  
  export type ColorTheme = {
    id: string
    primary: string
    secondary: string
    accent: string
  }
  
  export type SkillLevel = 1 | 2 | 3 | 4 | 5
  
  export type ResumeData = {
    selectedTemplate: ResumeTemplate["id"]
    personalInfo: {
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
}