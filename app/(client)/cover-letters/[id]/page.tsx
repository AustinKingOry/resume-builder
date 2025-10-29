"use client"
import { useState, useEffect } from "react"
import { CoverLetterEditor } from "@/components/cover-letters/cover-letter-editor"
import type { CoverLetter } from "@/lib/types/cover-letter"
import { useParams } from "next/navigation"

// Mock database of cover letters
const mockCoverLetters: Record<string, CoverLetter> = {
  "1": {
    id: "1",
    title: "Software Engineer at Safaricom",
    company: "Safaricom PLC",
    position: "Senior Software Engineer",
    jobDescription:
      "We're looking for a Senior Software Engineer to join our Digital Innovation team. You'll work on building scalable platforms that serve millions of users across East Africa...",
    content:
      "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Software Engineer position at Safaricom PLC. With over five years of experience building scalable web applications and a deep passion for leveraging technology to improve lives across Africa, I am excited about the opportunity to contribute to your Digital Innovation team.\n\nIn my current role at [Company], I have led the development of several high-impact features that improved user engagement by 40% and reduced load times by 60%. My experience with modern JavaScript frameworks, cloud infrastructure, and agile methodologies aligns well with the requirements outlined in your job posting.\n\nWhat particularly excites me about Safaricom is your commitment to digital transformation across East Africa. I share your vision of using technology to create meaningful impact, and I believe my background in building solutions for emerging markets makes me a strong fit for your team.\n\nI would welcome the opportunity to discuss how my skills and experience can contribute to Safaricom's mission. Thank you for considering my application.\n\nBest regards,\n[Your Name]",
    status: "complete",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-21T14:30:00Z",
    wordCount: 342,
    downloads: 2,
  },
  "2": {
    id: "2",
    title: "Marketing Lead at Andela",
    company: "Andela",
    position: "Digital Marketing Lead",
    jobDescription:
      "We're seeking a Digital Marketing Lead to drive our marketing strategy across African markets. You'll lead campaigns, manage budgets, and build our brand presence...",
    content:
      "Dear Recruitment Team,\n\nWith over five years of experience in digital marketing across African markets, I am excited to apply for the Digital Marketing Lead position at Andela. Your mission to connect African talent with global opportunities resonates deeply with me, and I believe my background in growth marketing and community building makes me an ideal fit.\n\nIn my current role at [Company], I've successfully:\n• Increased user acquisition by 150% through targeted campaigns\n• Built and managed a monthly marketing budget of $50,000\n• Led a team of 5 marketing specialists across 3 countries\n• Grew social media following from 10K to 100K in 18 months\n\nWhat draws me to Andela is your focus on creating economic opportunities across Africa. I've built my career on similar principles, developing marketing strategies that not only drive business growth but also empower local communities.\n\nI would love the opportunity to bring my expertise in digital marketing and passion for African tech to your team.\n\nThank you for your consideration.\n\nWarm regards,\n[Your Name]",
    status: "complete",
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    wordCount: 298,
    downloads: 1,
  },
}

export default function ViewCoverLetterPage() {
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()

  const letter_id = params.id as string

  useEffect(() => {
    const fetchCoverLetter = async () => {
      setIsLoading(true)
      // Simulate API call with 2.5 second delay
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const letter = mockCoverLetters[letter_id]
      if (letter) {
        setCoverLetter(letter)
      }
      setIsLoading(false)
    }

    fetchCoverLetter()
  }, [letter_id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cover letter...</p>
        </div>
      </div>
    )
  }

  if (!coverLetter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Cover letter not found</p>
        </div>
      </div>
    )
  }

  return <CoverLetterEditor mode="view" initialData={coverLetter} />
}
