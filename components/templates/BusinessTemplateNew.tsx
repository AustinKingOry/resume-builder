import type { ResumeData } from "../../lib/types"
import { useRef, useEffect, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import "./styles/business.css"

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

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter=false }) => (
  <div 
    className={`business-page a4-page`} 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      paddingTop: pageNumber === 1 ? "0px" : `${margins.top}px`,
      paddingBottom: `${margins.bottom}px`
    }}
  >
    {children}
    {/* Page number footer */}
    {showFooter && (
      <div className="page-footer">
        <span className="page-number">{pageNumber} of {totalPages}</span>
      </div>
    )}
  </div>
);

interface ContentSection {
  type: 'header' | 'contactBar' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'references';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
}

// Business-focused template with professional styling
export const BusinessTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
  
  const defaultMargins = { top: 0, right: 0, bottom: 0, left: 0 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available height considering footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 30; // Reserve space for footer
  // In the splitting logic, add a buffer for better utilization
  const PAGE_BUFFER = 50; // Allow content to go slightly over if it's close

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${A4_WIDTH}px`;
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

  // Add this helper function to check if content can fit with better precision
  const canContentFit = (currentHeight: number, newContentHeight: number, isLastItem: boolean = false): boolean => {
    const remainingSpace = CONTENT_MAX_HEIGHT - currentHeight;
    
    // If it's the last item in a section, be more lenient
    if (isLastItem && newContentHeight <= remainingSpace + 100) {
      return true;
    }
    
    // Otherwise use normal logic with buffer
    return currentHeight + newContentHeight <= CONTENT_MAX_HEIGHT + PAGE_BUFFER;
  };

  // Create content sections with measurement
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];

    // Header section (only on first page)
    const headerElement = (
      <header key="header" className="border-b-2 border-resume-blue py-6 px-8">
        <h1 className="text-3xl font-bold text-resume-blue">{personalInfo.name}</h1>
        <p className="text-xl text-gray-600">{personalInfo.title}</p>
      </header>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isHeader: true
    });

    // Contact information bar (only on first page)
    const contactBarElement = (
      <div key="contactBar" className="bg-gray-50 py-3 px-8 flex flex-wrap justify-between text-sm" style={{
        paddingBottom: `${margin.top}px`
      }}>
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
    );
    sections.push({
      type: 'contactBar',
      content: contactBarElement,
      canSplit: false,
      isHeader: true
    });

    // Summary section
    if (summary) {
      const summaryElement = (
        <section key="summary" style={{
            paddingLeft: `${margin.left}px`,
            paddingRight: `${margin.right}px`
        }}>
          <h2 className="text-xl font-bold text-resume-blue mb-3">Professional Profile</h2>
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
            <div key={index} className="mb-5 experience-item" style={{
                paddingLeft: `${margin.left}px`,
                paddingRight: `${margin.right}px`
            }}>
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
          <section>
            <h2 className="text-xl font-bold text-resume-blue mb-4" style={{
            paddingLeft: `${margin.left}px`,
            paddingRight: `${margin.right}px`
        }}>Professional Experience</h2>
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
            <div key={index} className="mb-4 education-item" style={{
                paddingLeft: `${margin.left}px`,
                paddingRight: `${margin.right}px`
            }}>
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
          <section style={{
            paddingLeft: `${margin.left}px`,
            paddingRight: `${margin.right}px`
        }}>
            <h2 className="text-xl font-bold text-resume-blue mb-4" style={{
            paddingLeft: `${margin.left}px`,
            paddingRight: `${margin.right}px`
            }}>Education</h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true
      });
    }

    // Two-column sections (Skills, Certifications, References)
    if (skills.length > 0 || certifications.length > 0 || referees.length > 0) {
      const twoColumnElement = (
        <div key="twoColumn" className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{
            paddingLeft: `${margin.left}px`,
            paddingRight: `${margin.right}px`
        }}>
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
                            style={{ width: `${skillLevels[skill]}%` }}
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
      );

      sections.push({
        type: 'skills',
        content: twoColumnElement,
        canSplit: false
      });
    }

    return sections;
  }, [personalInfo, summary, experience, education, skills, skillLevels, certifications, referees, margin]);

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
          <h2 key={`${section.type}-header`} className="text-xl font-bold text-resume-blue mb-4" style={{
            paddingLeft: `${margin.left}px`,
            paddingRight: `${margin.right}px`
        }}>
            {section.type === 'experience' && 'Professional Experience'}
            {section.type === 'education' && 'Education'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // If adding this item would exceed page height, create new page
          if (!canContentFit(currentPageHeight, itemHeight, index === section.items.length - 1) && currentPageContent.length > 0) {
            addPage([...currentPageContent]);
            currentPageContent = [];
            currentPageHeight = 0;
            
            // Add header again for new page if this is not the first item
            if (index > 0) {
              currentPageContent.push(sectionHeader);
              currentPageHeight += headerHeight;
            }
          }

          currentPageContent.push(...itemWithHeader);
          currentPageHeight += itemHeight;
        }

        // Add section spacing
        currentPageHeight += 24; // space-y-6 equivalent
      } else {
        // Handle non-splittable sections
        const sectionHeight = await measureElement(section.content);

        if (currentPageHeight + sectionHeight > CONTENT_MAX_HEIGHT + PAGE_BUFFER && currentPageContent.length > 0) {
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
  }, [createContentSections, CONTENT_MAX_HEIGHT, margin]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="business-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        {/* Hidden measurement container */}
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="business-container business-template">
      {/* Hidden measurement container */}
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

export default BusinessTemplateNew;