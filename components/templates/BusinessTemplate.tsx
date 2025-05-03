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
// Business-focused template with professional styling
export const BusinessTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-body text-gray-800">
      {/* Header with bold name and subtle border */}
      <header className="border-b-2 border-resume-blue py-6 px-8">
        <h1 className="text-3xl font-bold text-resume-blue">{personalInfo.name}</h1>
        <p className="text-xl text-gray-600">{personalInfo.title}</p>
      </header>

      {/* Contact information bar */}
      <div className="bg-gray-50 py-3 px-8 flex flex-wrap justify-between text-sm">
        <div className="space-x-6 flex flex-wrap">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="space-x-4 flex">
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.socialMedia.linkedin && <span>LinkedIn</span>}
          {personalInfo.socialMedia.github && <span>GitHub</span>}
          {personalInfo.socialMedia.twitter && <span>Twitter</span>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xl font-bold text-resume-blue mb-3">Professional Profile</h2>
            <p>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-resume-blue mb-4">Professional Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-5">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="font-medium">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                    {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-bold text-lg">{exp.title}</h3>
                    <p className="font-semibold text-gray-700 mb-2">{exp.company}</p>
                    <div className="text-sm">{formatDescription(exp.description)}</div>
                  </div>
                </div>
                {index < experience.length - 1 && <hr className="my-4" />}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-resume-blue mb-4">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="font-medium">{edu.startDate} - {edu.endDate}</p>
                    {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-700 mb-1">{edu.school}</p>
                    {edu.description && <p className="text-sm">{edu.description}</p>}
                  </div>
                </div>
                {index < education.length - 1 && <hr className="my-3" />}
              </div>
            ))}
          </section>
        )}

        {/* Two-column layout for Skills and Certifications/References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-resume-blue mb-3">Key Skills</h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill} className="grid grid-cols-6 gap-1 items-center">
                      <div className="col-span-2">
                        <span className="font-medium">{skill}</span>
                      </div>
                      {skillLevels[skill] && (
                        <div className="col-span-4 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-resume-blue h-2 rounded-full" 
                            style={{ width: `${(skillLevels[skill] / 5) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-resume-blue mb-3">Certifications</h2>
                {certifications.map((cert, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-sm text-gray-600">
                      {cert.issuer} • {cert.date}
                      {cert.expiry && <span> (Expires: {cert.expiry})</span>}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* References */}
            {referees.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-resume-blue mb-3">References</h2>
                {referees.map((referee, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-semibold">{referee.name}</p>
                    <p className="text-sm">{referee.position} at {referee.company}</p>
                    <p className="text-sm text-gray-600">{referee.email} • {referee.phone}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTemplate;