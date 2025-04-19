import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter, Github } from "lucide-react"
import Image from "next/image"
import type { ResumeData } from "../../types"

const formatDescription = (description: string | undefined) => {
    if (!description) return null
    const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
    if (listItems.length > 0) {
      return (
        <ul className="list-disc list-inside">
          {listItems.map((item, index) => (
            <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      )
    }
    return <p>{description}</p>
}

export default function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="space-y-6 bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center gap-6 border-b pb-6">
        {data.personalInfo?.photo && (
          <Image
            src={data.personalInfo.photo || "/placeholder.svg"}
            alt={data.personalInfo?.name || "Profile"}
            width={120}
            height={120}
            className="rounded-lg"
            unoptimized
          />
        )}
        <div>
          <h1 className="text-4xl font-bold">{data.personalInfo?.name}</h1>
          <p className="text-xl text-primary">{data.personalInfo?.title}</p>
          <div className="flex gap-4 mt-2">
            <div className="space-y-1">
              <p>{data.personalInfo?.email}</p>
              <p>{data.personalInfo?.phone}</p>
            </div>
            <div className="space-y-1">
              <p>{data.personalInfo?.location}</p>
              <p>{data.personalInfo?.website}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {data.personalInfo?.socialMedia?.linkedin && (
              <a href={data.personalInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {data.personalInfo?.socialMedia?.twitter && (
              <a href={data.personalInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {data.personalInfo?.socialMedia?.github && (
              <a href={data.personalInfo.socialMedia.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-primary">About Me</h2>
          <p>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Experience</h2>
        {data.experience?.map((exp, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                  <p className="text-primary">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p>{exp.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                {formatDescription(exp.description)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills?.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Education</h2>
        {data.education?.map((edu, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{edu.degree}</h3>
                  <p className="text-primary">{edu.school}</p>
                </div>
                <div className="text-right">
                  <p>{edu.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              </div>
              <p className="mt-2">{edu.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.certifications.map((cert, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-bold">{cert.name}</h3>
                  <p className="text-primary">{cert.issuer}</p>
                  <p className="text-sm text-muted-foreground">{cert.date}</p>
                  {cert.expiry && <p className="text-sm text-muted-foreground">Expires: {cert.expiry}</p>}
                  {cert.id && <p className="text-sm">ID: {cert.id}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.referees && data.referees.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.referees.map((referee, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-bold">{referee.name}</h3>
                  <p className="text-primary">{referee.position}</p>
                  <p>{referee.company}</p>
                  <p className="text-sm">{referee.email}</p>
                  <p className="text-sm">{referee.phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

