import Image from "next/image"
import type { ResumeData } from "../../lib/types"
import { Globe } from "lucide-react"

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
  const resumeData = data;
  return (
    <div className="bg-white font-sans max-w-4xl mx-auto">
      {/* Header */}
      <header className="bg-teal-600 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{resumeData.personalInfo?.name || "Your Name"}</h1>
          <p className="text-sm">{resumeData.personalInfo?.title || "Your Title"}</p>

          <div className="mt-4 text-sm space-y-1 flex items-center flex-row gap-3">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{resumeData.personalInfo?.email || "your.email@example.com"}</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{resumeData.personalInfo?.phone || "Your Phone Number"}</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{resumeData.personalInfo?.location || "Your Location"}</span>
            </div>
            {data.personalInfo.website && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
          </div>

          <div className="mt-4 flex space-x-3">
            {resumeData.personalInfo?.socialMedia?.linkedin && (
              <a href={resumeData.personalInfo.socialMedia.linkedin} className="text-white hover:text-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            )}
            {resumeData.personalInfo?.socialMedia?.twitter && (
              <a href={resumeData.personalInfo.socialMedia.twitter} className="text-white hover:text-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            )}
            {resumeData.personalInfo?.socialMedia?.github && (
              <a href={resumeData.personalInfo.socialMedia.github} className="text-white hover:text-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {resumeData.personalInfo?.photo && (
          <div className="ml-4">
            <Image
              src={resumeData.personalInfo.photo || "/placeholder.svg"}
              alt={resumeData.personalInfo.name}
              className="w-28 h-28 rounded-full object-cover border-2 border-white"
              width={112}
              height={112}
            />
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="p-6">
        {/* Professional Summary */}
        <section className="mb-6">
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Professional Summary</h2>
          <p className="text-gray-700">{resumeData.summary || "Your professional summary goes here."}</p>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Experience</h2>
          {(resumeData.experience || []).map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{exp.title || "Job Title"}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company || "Company"} | {exp.startDate || "Start Date"} -{" "}
                    {exp.current ? "Present" : exp.endDate || "End Date"}
                  </p>
                </div>
              </div>
              {formatDescription(exp.description)}
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Education</h2>
          {(resumeData.education || []).map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-gray-800">{edu.degree || "Degree"}</h3>
              <p className="text-sm text-gray-600">
                {edu.school || "School"} | {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
              </p>
              {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(resumeData.skills || []).map((skill, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">Certifications</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="mb-2">
                  <h3 className="text-lg font-semibold">{cert.name}</h3>
                <p className="text-gray-600">
                  {cert.issuer} | {cert.date}
                </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* References */}
        {resumeData.referees && resumeData.referees.length > 0 && (
          <section className="mb-6">
            <h2 className="text-teal-600 text-lg font-bold border-b border-teal-600 pb-1 mb-3">References</h2>
            <p className="text-sm text-gray-700">Available upon request</p>
          </section>
        )}
      </div>
    </div>
  )
}

