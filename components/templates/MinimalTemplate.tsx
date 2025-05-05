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
// Minimalist template with clean typography and minimal styling
export const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-sans text-gray-800 max-w-4xl mx-auto p-8 add-padding">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{personalInfo.name}</h1>
        <p className="text-xl text-gray-600 mb-3">{personalInfo.title}</p>
        
        {/* Contact details in a single row */}
        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>

        {/* Social media */}
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
            {personalInfo.socialMedia.linkedin && <span>LinkedIn</span>}
            {personalInfo.socialMedia.twitter && <span>Twitter</span>}
            {personalInfo.socialMedia.github && <span>GitHub</span>}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <p className="text-center">{summary}</p>
        </section>
      )}

      <div className="space-y-8">
        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                    <h3 className="font-medium">{exp.title} • {exp.company}</h3>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <p className="text-sm text-gray-600 mb-1">{exp.location}</p>}
                  <div className="text-sm mt-1">{formatDescription(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                    <h3 className="font-medium">{edu.degree} • {edu.school}</h3>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  {edu.location && <p className="text-sm text-gray-600 mb-1">{edu.location}</p>}
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Skills</h2>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-3 py-1 text-sm border border-gray-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="text-sm text-center">
                  <span className="font-medium">{cert.name}</span> • {cert.issuer} • {cert.date}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {referees.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">References</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {referees.map((referee, index) => (
                <div key={index} className="text-sm text-center">
                  <h3 className="font-medium">{referee.name}</h3>
                  <p>{referee.position} at {referee.company}</p>
                  <p className="text-gray-600">{referee.email} • {referee.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalistTemplate;
