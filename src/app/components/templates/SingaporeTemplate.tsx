import { Mail, Phone, MapPin } from "lucide-react"
import type { ResumeData } from "../../types"

export default function SingaporeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">{data.personalInfo.name}</h1>
        <p className="text-xl text-gray-600">{data.personalInfo.title}</p>
        <div className="flex items-center space-x-4 mt-2">
          <Mail className="w-4 h-4" />
          <span>{data.personalInfo.email}</span>
          <Phone className="w-4 h-4" />
          <span>{data.personalInfo.phone}</span>
          <MapPin className="w-4 h-4" />
          <span>{data.personalInfo.location}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Professional Summary</h2>
        <p>{data.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{exp.title}</h3>
            <p className="text-gray-600">
              {exp.company} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </p>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Education</h2>
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
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <div className="flex flex-wrap">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Certifications</h2>
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

