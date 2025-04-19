import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Linkedin, Twitter, Github, Mail, Phone, MapPin, Globe } from "lucide-react"
import Image from "next/image"
import type { ResumeData } from "../../lib/types"

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

export default function MilanTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-white rounded-lg shadow">
      {/* Left Column */}
      <div className="space-y-6">
        {data.personalInfo?.photo && (
          <div className="flex justify-center">
            <Image
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt={data.personalInfo?.name || "Profile"}
              width={150}
              height={150}
              className="rounded-full"
              unoptimized
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.personalInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo?.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {data.skills?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {data.certifications && data.certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.certifications.map((cert, index) => (
                <div key={index}>
                  <h4 className="font-medium">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-sm">{cert.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column */}
      <div className="col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{data.personalInfo?.name}</h1>
          <p className="text-xl text-muted-foreground">{data.personalInfo?.title}</p>
          <div className="flex gap-2">
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

        {data.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.summary}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.experience?.map((exp, index) => (
              <div key={index}>
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="text-sm">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
                <p className="text-sm">{exp.location}</p>
                <div className="mt-2">{exp.description ? formatDescription(exp.description) : null}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.education?.map((edu, index) => (
              <div key={index}>
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-muted-foreground">{edu.school}</p>
                <p className="text-sm">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-sm">{edu.location}</p>
                <p className="mt-2">{edu.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {data.referees && data.referees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.referees.map((referee, index) => (
                <div key={index}>
                  <h4 className="font-medium">{referee.name}</h4>
                  <p className="text-muted-foreground">
                    {referee.position} at {referee.company}
                  </p>
                  <p className="text-sm">Email: {referee.email}</p>
                  <p className="text-sm">Phone: {referee.phone}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

