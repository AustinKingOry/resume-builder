import type { ResumeData } from "../../lib/types"

const formatDescription = (description: string | undefined) => {
  if (!description) return null
  const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
  if (listItems.length > 0) {
    return (
      <ul className="list-disc ml-5">
        {listItems.map((item, index) => (
          <li key={index} className="text-gray-800 mb-1">
            {item.replace(/^[-*]\s*/, "")}
          </li>
        ))}
      </ul>
    )
  }
  return <p>{description}</p>
}
// Executive template with professional design for senior positions
export const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-serif p-8 text-gray-800">
      {/* Header with border */}
      <header className="mb-6">
        <div className="border-b-4 border-resume-burgundy pb-4 mb-4">
          <h1 className="text-4xl font-bold mb-1 text-resume-burgundy">{personalInfo.name}</h1>
          <p className="text-xl font-medium text-gray-700">{personalInfo.title}</p>
        </div>
        
        {/* Contact information */}
        <div className="flex flex-wrap justify-between text-sm">
          <div className="space-y-1">
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.email && <p>{personalInfo.email}</p>}
          </div>
          <div className="space-y-1 text-right">
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
      </header>

      {/* Summary - highlighted for executive resume */}
      {summary && (
        <section className="mb-6 bg-gray-50 border-l-4 border-resume-burgundy p-4">
          <h2 className="text-lg font-bold mb-2 text-resume-burgundy">Executive Summary</h2>
          <p className="text-gray-800">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-resume-burgundy border-b-2 border-gray-200 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <span className="text-sm">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="italic">{exp.company}</span>
                {exp.location && <span className="text-gray-600 text-sm">{exp.location}</span>}
              </div>
              <div className="text-sm">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-resume-burgundy border-b-2 border-gray-200 pb-1">
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm">{edu.school}</p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                    {edu.location && `, ${edu.location}`}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-resume-burgundy border-b-2 border-gray-200 pb-1">
                Certifications
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-2 text-sm">
                  <p className="font-semibold">{cert.name}</p>
                  <p>{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-resume-burgundy border-b-2 border-gray-200 pb-1">
                Areas of Expertise
              </h2>
              <div className="grid grid-cols-1 gap-1">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-2 h-2 bg-resume-burgundy rounded-full mr-2"></div>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {referees.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-resume-burgundy border-b-2 border-gray-200 pb-1">
                Professional References
              </h2>
              {referees.map((referee, index) => (
                <div key={index} className="mb-3">
                  <p className="font-semibold">{referee.name}</p>
                  <p className="text-sm">{referee.position}, {referee.company}</p>
                  <p className="text-sm text-gray-600">{referee.email} • {referee.phone}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
