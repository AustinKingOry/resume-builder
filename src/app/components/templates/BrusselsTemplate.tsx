import type { ResumeData } from "../../types"

export default function BrusselsTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto flex">
      <div className="w-2/3 pr-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{data.personalInfo.name}</h1>
          <p className="text-xl text-gray-600">{data.personalInfo.title}</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="text-gray-700">{data.summary}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Employment History</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              <p className="text-gray-600">
                {exp.company}, {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
              <ul className="list-disc list-inside text-gray-700">
                {exp.description.split(". ").map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">
                {edu.school}, {edu.startDate} - {edu.endDate}
              </p>
              <p className="text-gray-700">{edu.description}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="w-1/3 bg-gray-100 p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Details</h2>
          <p>{data.personalInfo.location}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.email}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <ul className="list-disc list-inside">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Certifications</h2>
            {data.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-gray-600">
                  {cert.issuer}, {cert.date}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

