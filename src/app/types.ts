export type ResumeData = {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    photo: string
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
    date: string
    description: string
  }[]
  education: {
    degree: string
    school: string
    date: string
  }[]
  skills: string[]
}

