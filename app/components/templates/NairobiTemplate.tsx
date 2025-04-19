import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github } from "lucide-react"
import Image from "next/image"
import type { ResumeData } from "../../../lib/types"

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

export default function NairobiTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 text-gray-800 p-8 max-w-4xl mx-auto">
      <header className="bg-teal-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.personalInfo.name}</h1>
            <p className="text-xl">{data.personalInfo.title}</p>
          </div>
          {data.personalInfo.photo && (
            <Image
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt={data.personalInfo.name}
              width={100}
              height={100}
              className="rounded-full border-4 border-white"
            />
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span>{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{data.personalInfo.location}</span>
          </div>
          {data.personalInfo.website && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-4">
          {data.personalInfo.socialMedia?.linkedin && (
            <a href={data.personalInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {data.personalInfo.socialMedia?.twitter && (
            <a href={data.personalInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {data.personalInfo.socialMedia?.github && (
            <a href={data.personalInfo.socialMedia.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </header>

      <main className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">Professional Summary</h2>
          <p>{data.summary}</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              <p className="text-gray-600">
                {exp.company} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
              <p className="text-gray-600 mb-2">{exp.location}</p>
              {formatDescription(exp.description)}
            </div>
          ))}
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">
                {edu.school} | {edu.startDate} - {edu.endDate}
              </p>
              <p className="text-gray-600 mb-2">{edu.location}</p>
              <p>{edu.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {data.certifications && data.certifications.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Certifications</h2>
            {data.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <p className="text-gray-600">
                  {cert.issuer} | {cert.date}
                </p>
              </div>
            ))}
          </section>
        )}

        {data.referees && data.referees.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">References</h2>
            {data.referees.map((referee, index) => (
              <div key={index} className="mb-2">
                <h3 className="text-lg font-semibold">{referee.name}</h3>
                <p className="text-gray-600">
                  {referee.position} at {referee.company}
                </p>
                <p className="text-gray-600">
                  {referee.email} | {referee.phone}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

