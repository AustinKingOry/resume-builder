import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import type { ResumeData } from "../../types"

export default function OsloTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-gray-900 text-white p-8 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        {data.personalInfo.photo && (
          <Image
            src={data.personalInfo.photo || "/placeholder.svg"}
            alt={data.personalInfo.name}
            width={150}
            height={150}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-4xl font-bold">{data.personalInfo.name}</h1>
        <p className="text-xl text-gray-400">{data.personalInfo.title}</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Mail className="w-4 h-4" />
          <span>{data.personalInfo.email}</span>
          <Phone className="w-4 h-4" />
          <span>{data.personalInfo.phone}</span>
          <MapPin className="w-4 h-4" />
          <span>{data.personalInfo.location}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">About Me</h2>
        <p>{data.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{exp.title}</h3>
            <p className="text-gray-400">
              {exp.company} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </p>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{edu.degree}</h3>
            <p className="text-gray-400">
              {edu.school} | {edu.startDate} - {edu.endDate}
            </p>
            <p>{edu.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">Skills</h2>
        <div className="flex flex-wrap">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-900 rounded-full px-3 py-1 text-sm font-semibold text-blue-200 mr-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-xl font-semibold">{cert.name}</h3>
              <p className="text-gray-400">
                {cert.issuer} | {cert.date}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

