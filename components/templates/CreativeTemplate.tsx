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
// Creative template with unique layout and style while maintaining ATS compatibility
export const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-display text-gray-800 bg-white">
      {/* Header with accent color */}
      <div className="bg-resume-teal py-8 px-10 text-white mb-8">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.name}</h1>
        <p className="text-xl opacity-90">{personalInfo.title}</p>
        
        {/* Divider line */}
        <div className="h-0.5 bg-white/30 my-4"></div>
        
        {/* Contact row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-between">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
        </div>
        
        {/* Social Media */}
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="flex gap-4 mt-4">
            {personalInfo.socialMedia.linkedin && (
              <span className="text-white/90 text-sm">LinkedIn</span>
            )}
            {personalInfo.socialMedia.github && (
              <span className="text-white/90 text-sm">GitHub</span>
            )}
            {personalInfo.socialMedia.twitter && (
              <span className="text-white/90 text-sm">Twitter</span>
            )}
            {personalInfo.website && (
              <span className="text-white/90 text-sm">{personalInfo.website}</span>
            )}
          </div>
        )}
      </div>

      <div className="px-10">
        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-resume-teal">About Me</h2>
            <p className="leading-relaxed">{summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Experience */}
          <div className="col-span-2">
            {/* Experience */}
            {experience.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-resume-teal">Experience</h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-resume-teal">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-resume-teal"></div>
                      <h3 className="text-lg font-semibold leading-tight">{exp.title}</h3>
                      <p className="text-gray-700 mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        {exp.location && ` | ${exp.location}`}
                      </p>
                      <div className="text-sm">{formatDescription(exp.description)}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-resume-teal">Education</h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-resume-teal">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-resume-teal"></div>
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-gray-700 mb-1">{edu.school}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {edu.startDate} - {edu.endDate}
                        {edu.location && ` | ${edu.location}`}
                      </p>
                      {edu.description && <p className="text-sm">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column - Skills, Certifications, References */}
          <div>
            {/* Skills */}
            {skills.length > 0 && (
              <section className="mb-8 bg-gray-50 p-4 rounded-md">
                <h2 className="text-xl font-bold mb-4 text-resume-teal">Skills</h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span>{skill}</span>
                      </div>
                      {skillLevels[skill] && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-resume-teal h-1.5 rounded-full" 
                            style={{ width: `${skillLevels[skill]}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="mb-8 bg-gray-50 p-4 rounded-md">
                <h2 className="text-xl font-bold mb-3 text-resume-teal">Certifications</h2>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            {referees.length > 0 && (
              <section className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-xl font-bold mb-3 text-resume-teal">References</h2>
                <div className="space-y-3">
                  {referees.map((referee, index) => (
                    <div key={index} className="text-sm">
                      <h3 className="font-semibold">{referee.name}</h3>
                      <p className="text-gray-700">{referee.position} at {referee.company}</p>
                      <p className="text-gray-600">{referee.email}</p>
                      <p className="text-gray-600">{referee.phone}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;