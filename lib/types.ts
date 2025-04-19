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
  
  