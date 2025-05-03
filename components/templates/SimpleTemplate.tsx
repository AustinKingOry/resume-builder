import type { ResumeData } from "../../lib/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

// Simple and clean template with good readability and no distractions
export const SimpleTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  return (
    <div className="resume-page font-sans text-gray-800 p-8">
      {/* Simple header */}
      <header className="mb-6 flex items-center gap-4">
        {personalInfo.photo && (
          <Avatar className="w-20 h-20">
            <AvatarImage src={personalInfo.photo} alt={personalInfo.name} />
            <AvatarFallback>{personalInfo.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        )}
        
        <div>
          <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
          <p className="text-lg text-gray-600 mb-2">{personalInfo.title}</p>
          
          {/* Simple contact details layout */}
          <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.website && <div>{personalInfo.website}</div>}
            {personalInfo.socialMedia.linkedin && <div>LinkedIn</div>}
            {personalInfo.socialMedia.github && <div>GitHub</div>}
            {personalInfo.socialMedia.twitter && <div>Twitter</div>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 border-b border-gray-200 pb-1">Summary</h2>
          <p className="text-sm">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-base">{exp.title}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{exp.company}{exp.location && `, ${exp.location}`}</p>
              <div className="text-sm">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-base">{edu.degree}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{edu.school}{edu.location && `, ${edu.location}`}</p>
              {edu.description && <p className="text-sm">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="inline-block text-sm py-1">
                {skill}{skills.indexOf(skill) < skills.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2 text-sm">
              <span className="font-medium">{cert.name}</span> • {cert.issuer} • {cert.date}
            </div>
          ))}
        </section>
      )}

      {/* References */}
      {referees.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">References</h2>
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
  );
};

export default SimpleTemplate;
