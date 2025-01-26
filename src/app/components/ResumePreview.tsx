/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import type { ResumeData } from "../types"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Linkedin, Twitter, Github } from "lucide-react"
import Image from "next/image"

type ResumePreviewProps = {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const [pdfError, setPdfError] = useState<string | null>(null)

  const exportToPDF = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    const addNewPageIfNeeded = (height: number) => {
      if (yPos + height > pageHeight - margin) {
        doc.addPage()
        yPos = margin
        return true
      }
      return false
    }

    // Add photo if it exists
    if (data.personalInfo?.photo) {
      try {
        if (typeof window !== "undefined") {
          const img = new window.Image()
          img.crossOrigin = "anonymous"
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = data.personalInfo.photo
          })
          // Add photo to the top right
          doc.addImage(img, "JPEG", pageWidth - margin - 30, yPos, 30, 30, undefined, "FAST")
        } else {
          console.warn("Unable to load image in non-browser environment")
        }
      } catch (error) {
        console.error("Error loading image:", error)
        setPdfError("Failed to load profile image. PDF generated without image.")
      }
    }

    // Name - large and centered with blue tint
    doc.setFont("helvetica", "bold")
    doc.setFontSize(24)
    doc.setTextColor(41, 65, 171) // Navy blue
    const name = data.personalInfo?.name?.toUpperCase() || "YOUR NAME"
    const nameWidth = doc.getTextWidth(name)
    doc.text(name, (pageWidth - nameWidth) / 2, yPos + 10)
    yPos += 20

    // Job Title - centered
    doc.setFont("helvetica", "normal")
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    const title = data.personalInfo?.title?.toUpperCase() || "PROFESSIONAL RESUME"
    const titleWidth = doc.getTextWidth(title)
    doc.text(title, (pageWidth - titleWidth) / 2, yPos)
    yPos += 10

    // Draw a horizontal line
    doc.setDrawColor(41, 65, 171)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    // Calculate column positions
    const leftColX = margin
    const leftColWidth = 60
    const rightColX = margin + leftColWidth + 10
    const rightColWidth = pageWidth - rightColX - margin

    // Left Column
    // Contact Section
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(41, 65, 171) // Navy blue for headers
    doc.text("CONTACT", leftColX, yPos)
    yPos += 7

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60) // Dark gray for content
    doc.text(data.personalInfo?.phone || "", leftColX, yPos)
    yPos += 5
    doc.text(data.personalInfo?.email || "", leftColX, yPos)
    yPos += 5
    doc.text(data.personalInfo?.location || "", leftColX, yPos)
    yPos += 15

    // Skills Section
    addNewPageIfNeeded(20)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(41, 65, 171) // Navy blue for headers
    doc.text("SKILLS", leftColX, yPos)
    yPos += 7

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60) // Dark gray for content
    const skills = Array.isArray(data.skills) ? data.skills : []
    skills.forEach((skill) => {
      if (addNewPageIfNeeded(5)) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(41, 65, 171)
        doc.text("SKILLS (continued)", leftColX, yPos)
        yPos += 7
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
      }
      doc.text(skill, leftColX, yPos)
      yPos += 5
    })
    yPos += 10

    // Education Section
    addNewPageIfNeeded(20)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(41, 65, 171) // Navy blue for headers
    doc.text("EDUCATION", leftColX, yPos)
    yPos += 7

    doc.setTextColor(60, 60, 60) // Dark gray for content
    doc.setFontSize(10)
    data.education?.forEach((edu, index) => {
      if (addNewPageIfNeeded(20)) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(41, 65, 171)
        doc.text("EDUCATION (continued)", leftColX, yPos)
        yPos += 7
        doc.setTextColor(60, 60, 60)
        doc.setFontSize(10)
      }
      doc.setFont("helvetica", "bold")
      doc.text(edu.degree, leftColX, yPos)
      yPos += 5
      doc.setFont("helvetica", "normal")
      doc.text(edu.school, leftColX, yPos)
      yPos += 5
      doc.setFont("helvetica", "italic")
      doc.text((edu.startDate + " - "+edu.endDate), leftColX, yPos)
      yPos += 10
    })

    // Reset Y position for right column
    yPos = margin + 50

    // Right Column
    // Profile Section
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(41, 65, 171) // Navy blue for headers
    doc.text("PROFILE", rightColX, yPos)
    yPos += 7

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60) // Dark gray for content
    const summaryLines = doc.splitTextToSize(data.summary || "", rightColWidth)
    summaryLines.forEach((line: string, index: number) => {
      if (addNewPageIfNeeded(5)) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(41, 65, 171)
        doc.text("PROFILE (continued)", rightColX, yPos)
        yPos += 7
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
      }
      doc.text(line, rightColX, yPos)
      yPos += 5
    })
    yPos += 10

    // Work Experience Section
    addNewPageIfNeeded(20)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(41, 65, 171) // Navy blue for headers
    doc.text("WORK EXPERIENCE", rightColX, yPos)
    yPos += 7

    data.experience?.forEach((exp, index) => {
      if (addNewPageIfNeeded(20)) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(41, 65, 171)
        doc.text("WORK EXPERIENCE (continued)", rightColX, yPos)
        yPos += 7
      }
      // Job Title and Company
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60) // Dark gray for content
      doc.text(exp.title, rightColX, yPos)

      // Date aligned to the right
      const dateWidth = doc.getTextWidth(exp.startDate + " - " + exp.endDate)
      doc.setFont("helvetica", "italic")
      doc.text((exp.startDate + " - " + exp.endDate), pageWidth - margin - dateWidth, yPos)
      yPos += 5

      // Company
      doc.setFont("helvetica", "semibold")
      doc.setFontSize(10)
      doc.text(exp.company, rightColX, yPos)
      yPos += 7

      // Description
      doc.setFont("helvetica", "normal")
      const descLines = doc.splitTextToSize(exp.description, rightColWidth)
      descLines.forEach((line: string) => {
        if (addNewPageIfNeeded(5)) {
          doc.setFont("helvetica", "bold")
          doc.setFontSize(11)
          doc.setTextColor(41, 65, 171)
          doc.text("WORK EXPERIENCE (continued)", rightColX, yPos)
          yPos += 7
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
          doc.setTextColor(60, 60, 60)
        }
        doc.text(line, rightColX, yPos)
        yPos += 5
      })
      yPos += 5
    })

    // Add social media links if they exist
    if (data.personalInfo?.socialMedia) {
      addNewPageIfNeeded(20)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(41, 65, 171) // Navy blue for headers
      doc.text("CONNECT", leftColX, yPos)
      yPos += 5
      doc.setFont("helvetica", "normal")
      doc.setTextColor(60, 60, 60)

      if (data.personalInfo.socialMedia.linkedin) {
        doc.textWithLink("LinkedIn", leftColX, yPos, {
          url: data.personalInfo.socialMedia.linkedin,
        })
        yPos += 5
      }
      if (data.personalInfo.socialMedia.github) {
        doc.textWithLink("GitHub", leftColX, yPos, {
          url: data.personalInfo.socialMedia.github,
        })
        yPos += 5
      }
      if (data.personalInfo.socialMedia.twitter) {
        doc.textWithLink("Twitter", leftColX, yPos, {
          url: data.personalInfo.socialMedia.twitter,
        })
      }
    }

    doc.save("resume.pdf")
  }

  return (
    <div className="space-y-6 bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-lg">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center space-x-4">
          {data.personalInfo?.photo && (
            <Image
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt={data.personalInfo?.name || "Profile"}
              width={100}
              height={100}
              className="rounded-full flex-shrink-0"
              unoptimized
            />
          )}
          <div>
            <CardTitle className="text-3xl text-blue-600">{data.personalInfo?.name || "Your Name"}</CardTitle>
            <div className="text-gray-600">
              <p>{data.personalInfo?.email || "Email"}</p>
              <p>{data.personalInfo?.phone || "Phone"}</p>
              <p>{data.personalInfo?.location || "Location"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex space-x-4">
          {data.personalInfo?.socialMedia?.linkedin && (
            <a href={data.personalInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="text-blue-500" />
            </a>
          )}
          {data.personalInfo?.socialMedia?.twitter && (
            <a href={data.personalInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="text-blue-400" />
            </a>
          )}
          {data.personalInfo?.socialMedia?.github && (
            <a href={data.personalInfo.socialMedia.github} target="_blank" rel="noopener noreferrer">
              <Github className="text-gray-700" />
            </a>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{data.summary || "No summary provided"}</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-600">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {data.experience && data.experience.length > 0 ? (
            data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold text-blue-600">
                  {exp.title || "Job Title"} at {exp.company || "Company"}
                </h4>
                <p className="text-sm text-gray-500">{exp.startDate + " - " + exp.endDate || "Date"}</p>
                <p className="text-gray-700">{exp.description || "No description provided"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No experience listed</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-600">Education</CardTitle>
        </CardHeader>
        <CardContent>
          {data.education && data.education.length > 0 ? (
            data.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <h4 className="font-semibold text-blue-600">{edu.degree || "Degree"}</h4>
                <p className="text-gray-700">
                  {edu.school || "School"} - {edu.startDate + " - " + edu.endDate || "Date"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No education listed</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-red-600">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {Array.isArray(data.skills) && data.skills.length > 0 ? data.skills.join(", ") : "No skills listed"}
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={exportToPDF}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
      >
        <Download className="mr-2 h-4 w-4" />
        Export to PDF
      </Button>

      {pdfError && <p className="text-red-500 text-center mt-2">{pdfError}</p>}
    </div>
  )
}

