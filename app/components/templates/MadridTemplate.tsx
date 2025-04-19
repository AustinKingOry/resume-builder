import { Mail, Phone, MapPin } from "lucide-react"
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

export default function MadridTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      <header className="bg-blue-600 text-white p-6 mb-8">
        <h1 className="text-4xl font-bold">{data.personalInfo.name}</h1>
        <p className="text-xl">{data.personalInfo.title}</p>
        <div className="flex items-center space-x-4 mt-4">
          <Mail className="w-4 h-4" />
          <span>{data.personalInfo.email}</span>
          <Phone className="w-4 h-4" />
          <span>{data.personalInfo.phone}</span>
          <MapPin className="w-4 h-4" />
          <span>{data.personalInfo.location}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Professional Summary</h2>
        <p>{data.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{exp.title}</h3>
            <p className="text-gray-600">
              {exp.company} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </p>
            {formatDescription(exp.description)}
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{edu.degree}</h3>
            <p className="text-gray-600">
              {edu.school} | {edu.startDate} - {edu.endDate}
            </p>
            <p>{edu.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Skills</h2>
        <div className="flex flex-wrap">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-600">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-xl font-semibold">{cert.name}</h3>
              <p className="text-gray-600">
                {cert.issuer} | {cert.date}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

