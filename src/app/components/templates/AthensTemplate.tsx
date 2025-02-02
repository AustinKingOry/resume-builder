import { Mail, Phone, MapPin } from "lucide-react"
import type { ResumeData } from "../../types"

export default function AthensTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">{data.personalInfo.name}</h1>
        <p className="text-xl text-gray-600">{data.personalInfo.title}</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Mail className="w-4 h-4 text-gray-600" />
          <span>{data.personalInfo.email}</span>
          <Phone className="w-4 h-4 text-gray-600" />
          <span>{data.personalInfo.phone}</span>
          <MapPin className="w-4 h-4 text-gray-600" />
          <span>{data.personalInfo.location}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Professional Summary</h2>
        <p className="text-gray-700">{data.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Professional Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{exp.title}</h3>
            <p className="text-gray-600">
              {exp.company} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </p>
            <p className="text-gray-700">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{edu.degree}</h3>
            <p className="text-gray-600">
              {edu.school} | {edu.startDate} - {edu.endDate}
            </p>
            <p className="text-gray-700">{edu.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Areas of Expertise</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

