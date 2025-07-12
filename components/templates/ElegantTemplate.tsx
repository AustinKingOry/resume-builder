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
// Elegant template with classic serif font and refined styling
export const ElegantTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-serif text-gray-800 p-10 add-padding">
      {/* Elegant header with minimal styling */}
      <header className="mb-8 text-center border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold tracking-wide mb-1">{personalInfo.name}</h1>
        <p className="text-xl mb-3 text-gray-700">{personalInfo.title}</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
        
        {/* Social links */}
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="flex justify-center gap-6 mt-2 text-sm">
            {personalInfo.socialMedia.linkedin && <span>LinkedIn</span>}
            {personalInfo.socialMedia.github && <span>GitHub</span>}
            {personalInfo.socialMedia.twitter && <span>Twitter</span>}
          </div>
        )}
      </header>

      {/* Summary with subtle styling */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-center">Professional Summary</h2>
          <p className="text-center leading-relaxed italic">{summary}</p>
        </section>
      )}

      {/* Main columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Skills & Certifications */}
        <div className="space-y-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-center">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="text-sm">{skill}</span>
                    {skillLevels[skill] && (
                      <div className="flex">
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((level) => (
                          <span
                            key={level}
                            className={`inline-block w-1.5 h-1.5 mx-0.5 rounded-full ${
                              level <= skillLevels[skill] ? "bg-gray-800" : "bg-gray-200"
                            }`}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-center">Certifications</h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-3 text-sm">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-gray-600">{cert.issuer}</p>
                  <p className="text-gray-600">{cert.date}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Center and right columns - Experience & Education */}
        <div className="col-span-2 space-y-8">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-center">Professional Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="font-medium text-sm mb-1">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-600 mb-2">{exp.location}</p>}
                  <div className="text-sm">{formatDescription(exp.description)}</div>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-center">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <p className="font-medium text-sm mb-1">{edu.school}</p>
                  {edu.location && <p className="text-sm text-gray-600 mb-1">{edu.location}</p>}
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* References */}
          {referees.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-center">References</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {referees.map((referee, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold">{referee.name}</p>
                    <p>{referee.position} at {referee.company}</p>
                    <p className="text-gray-600">{referee.email} • {referee.phone}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
