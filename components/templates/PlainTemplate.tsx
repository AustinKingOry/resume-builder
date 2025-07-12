"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ResumeData } from "@/lib/types"
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github } from "lucide-react"

interface ResumePreviewProps {
  data: ResumeData
}

export function PlainTemplate({ data }: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const formatDescription = (description: string) => {
    return description.split("\n").map((line, index) => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        return (
          <li key={index} className="ml-4">
            {trimmedLine.substring(1).trim()}
          </li>
        )
      }
      return trimmedLine ? (
        <p key={index} className="mb-2">
          {trimmedLine}
        </p>
      ) : null
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          {data.personalInfo.photo && (
            <img
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.name || "Your Name"}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{data.personalInfo.title || "Professional Title"}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {data.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data.personalInfo.location}
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a href={data.personalInfo.website} className="text-blue-600 hover:underline">
                    Website
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-2">
              {data.personalInfo.socialMedia.linkedin && (
                <a href={data.personalInfo.socialMedia.linkedin} className="text-blue-600 hover:underline">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {data.personalInfo.socialMedia.twitter && (
                <a href={data.personalInfo.socialMedia.twitter} className="text-blue-600 hover:underline">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {data.personalInfo.socialMedia.github && (
                <a href={data.personalInfo.socialMedia.github} className="text-blue-600 hover:underline">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Work Experience</h3>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-gray-700">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm">
                      <ul className="list-disc list-outside">{formatDescription(exp.description)}</ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-700">{edu.school}</p>
                      {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Certifications</h3>
            <div className="space-y-3">
              {data.certifications.map((cert, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-gray-700">{cert.issuer}</p>
                      {cert.id && <p className="text-sm text-gray-600">ID: {cert.id}</p>}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <p>{formatDate(cert.date)}</p>
                      {cert.expiry && <p>Expires: {formatDate(cert.expiry)}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {data.referees && data.referees.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">References</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.referees.map((ref, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{ref.name}</h4>
                  <p className="text-gray-700">{ref.position}</p>
                  <p className="text-gray-700">{ref.company}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    {ref.email && <p>{ref.email}</p>}
                    {ref.phone && <p>{ref.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
