export type ResumeData = {
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
      [skill: string]: number
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
  
  