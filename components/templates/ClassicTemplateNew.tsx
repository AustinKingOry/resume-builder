import type { ResumeData } from "../../lib/types"
import { Phone, Mail, MapPin, Globe, Linkedin, Twitter, Github } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import "./styles/classic.css";
import { renderToString } from "react-dom/server";

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

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794; // 210mm
const A4_HEIGHT = 1123; // 297mm

interface MarginProps {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface TemplateProps {
  data: ResumeData;
  margins?: MarginProps;
  showFooter?: boolean;
}

interface PageProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
  margins: MarginProps;
  showFooter?: boolean;

}

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter = false }) => (
  <div 
    className="classic-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
    }}
  >
    {children}
    {showFooter && 
    <div className="page-footer">
      <span className="page-number">{pageNumber} of {totalPages}</span>
    </div>
    }
  </div>
);

interface ContentSection {
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'references';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
}

// Classic professional template with top header and clean sections
export const ClassicTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
  
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available height considering margins and footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - margin.top - margin.bottom - 40;

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${A4_WIDTH - margin.left - margin.right}px`;
      tempDiv.style.padding = '0';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      
      const measureContent = () => {
        container.appendChild(tempDiv);
        
        tempDiv.innerHTML = renderToString(element);
        
        const height = tempDiv.offsetHeight;
        container.removeChild(tempDiv);
        resolve(height);
      };

      setTimeout(measureContent, 0);
    });
  };

  // Create content sections with measurement
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];

    // Header section (only on first page)
    const headerElement = (
      <header key="header" className="mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.name}</h1>
        <p className="text-xl text-resume-slate mb-3">{personalInfo.title}</p>
        
        {/* Contact details */}
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} /> {personalInfo.phone}
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail size={14} /> {personalInfo.email}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} /> {personalInfo.location}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe size={14} /> {personalInfo.website}
            </div>
          )}
          {personalInfo.socialMedia.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin size={14} /> LinkedIn
            </div>
          )}
          {personalInfo.socialMedia.github && (
            <div className="flex items-center gap-1">
              <Github size={14} /> GitHub
            </div>
          )}
          {personalInfo.socialMedia.twitter && (
            <div className="flex items-center gap-1">
              <Twitter size={14} /> Twitter
            </div>
          )}
        </div>
      </header>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isHeader: true
    });

    // Summary section
    if (summary) {
      const summaryElement = (
        <section key="summary" className="resume-section">
          <h2 className="resume-section-title">Professional Summary</h2>
          <p>{summary}</p>
        </section>
      );
      sections.push({
        type: 'summary',
        content: summaryElement,
        canSplit: false
      });
    }

    // Experience sections
    if (experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="timeline-item">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{exp.title}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{exp.company}</span>
                {exp.location && <span className="text-gray-600">{exp.location}</span>}
              </div>
              <div className="text-sm mt-1">{formatDescription(exp.description)}</div>
            </div>
          );

          return {
            element: experienceElement,
            height: await measureElement(experienceElement),
            data: exp
          };
        })
      );

      sections.push({
        type: 'experience',
        content: (
          <section className="resume-section">
            <h2 className="resume-section-title">Experience</h2>
            {experienceItems.map(item => item.element)}
          </section>
        ),
        items: experienceItems,
        canSplit: true
      });
    }

    // Education sections
    if (education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="timeline-item">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{edu.school}</span>
                {edu.location && <span className="text-gray-600">{edu.location}</span>}
              </div>
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
          );

          return {
            element: educationElement,
            height: await measureElement(educationElement),
            data: edu
          };
        })
      );

      sections.push({
        type: 'education',
        content: (
          <section className="resume-section">
            <h2 className="resume-section-title">Education</h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true
      });
    }

    // Skills section
    if (skills.length > 0) {
      const skillsElement = (
        <section className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill} className="mb-2 mr-4">
                <span className="font-medium">{skill}</span>
                {skillLevels[skill] && (
                  <div className="mt-1">
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((level) => (
                      <span
                        key={level}
                        className={`skill-dot ${
                          level <= skillLevels[skill] ? "skill-dot-filled" : "skill-dot-empty"
                        }`}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
      sections.push({
        type: 'skills',
        content: skillsElement,
        canSplit: false
      });
    }

    // Certifications section
    if (certifications.length > 0) {
      const certificationsElement = (
        <section className="resume-section">
          <h2 className="resume-section-title">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="text-sm">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer} • {cert.date}</p>
                {cert.id && <p className="text-gray-500 text-xs">ID: {cert.id}</p>}
              </div>
            ))}
          </div>
        </section>
      );
      sections.push({
        type: 'certifications',
        content: certificationsElement,
        canSplit: false
      });
    }

    // References section
    if (referees.length > 0) {
      const referencesElement = (
        <section className="resume-section">
          <h2 className="resume-section-title">References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referees.map((referee, index) => (
              <div key={index} className="text-sm">
                <h3 className="font-semibold">{referee.name}</h3>
                <p>{referee.position} at {referee.company}</p>
                <p className="text-gray-600">{referee.email} • {referee.phone}</p>
              </div>
            ))}
          </div>
        </section>
      );
      sections.push({
        type: 'references',
        content: referencesElement,
        canSplit: false
      });
    }

    return sections;
  }, [personalInfo, summary, experience, education, skills, skillLevels, certifications, referees]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: React.ReactNode[] = [];
    let currentPageHeight = 0;
    let currentPageContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    const addPage = (content: React.ReactNode[]) => {
      newPages.push(
        <div key={`page-${pageNumber}`} className="resume-page font-body text-gray-800">
          {content}
        </div>
      );
      pageNumber++;
      isFirstPage = false;
    };

    for (const section of sections) {
      // Skip header sections after first page
      if (section.isHeader && !isFirstPage) {
        continue;
      }

      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="resume-section-title">
            {section.type === 'experience' && 'Experience'}
            {section.type === 'education' && 'Education'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // Use more lenient height checking
          if (currentPageHeight + itemHeight > CONTENT_MAX_HEIGHT + 100 && currentPageContent.length > 0) {
            addPage([...currentPageContent]);
            currentPageContent = [];
            currentPageHeight = 0;
            
            if (index > 0) {
              currentPageContent.push(sectionHeader);
              currentPageHeight += headerHeight;
            }
          }

          currentPageContent.push(...itemWithHeader);
          currentPageHeight += itemHeight;
        }
      } else {
        // Handle non-splittable sections
        const sectionHeight = await measureElement(section.content);

        // Use more lenient height checking
        if (currentPageHeight + sectionHeight > CONTENT_MAX_HEIGHT + 100 && currentPageContent.length > 0) {
          addPage([...currentPageContent]);
          currentPageContent = [];
          currentPageHeight = 0;
        }

        currentPageContent.push(section.content);
        currentPageHeight += sectionHeight;
      }
    }

    // Add the last page if it has content
    if (currentPageContent.length > 0) {
      addPage(currentPageContent);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="classic-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="classic-container classic-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      
      {pages.map((page, index) => (
        <Page 
          key={`page-${index + 1}`}
          pageNumber={index + 1} 
          totalPages={pages.length}
          margins={margin}
          showFooter={showFooter}
        >
            {page}
        </Page>
      ))}
    </div>
  );
};

export default ClassicTemplateNew;