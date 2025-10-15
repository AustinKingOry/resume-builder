/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import "./styles/highlight.css"

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

interface PageContent {
  main: React.ReactNode;
  sidebar: React.ReactNode;
  key: string;
}

interface ContentSection {
  type: string;
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
  isSidebar?: boolean;
  isFullWidth?: boolean;
}

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter }) => (
  <div className="template-page a4-page" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
    {children}
    {showFooter && 
      <div className="page-footer">
        <span className="page-number">{pageNumber} of {totalPages}</span>
      </div>
    }
  </div>
);

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

export const HighlightTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate available content height
  const HEADER_HEIGHT = 180; // Approximate height of purple header
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 80 - (margin.top + margin.bottom);

  // Measurement function
  const measureElement = useCallback((element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      
      // Set up measurement container with exact page constraints
      tempDiv.style.width = `${A4_WIDTH}px`;
      tempDiv.style.padding = `0`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.fontFamily = 'display';
      
      const measureContent = () => {
        container.appendChild(tempDiv);
        tempDiv.innerHTML = renderToString(element as React.ReactElement);
        
        // Force layout calculation
        const height = tempDiv.offsetHeight;
        container.removeChild(tempDiv);
        resolve(height);
      };

      requestAnimationFrame(measureContent);
    });
  }, []);

  // createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
    const sections: ContentSection[] = [];
    
    // Bold header with distinctive styling
    const headerContent = (
      <header className="bg-resume-purple text-white p-6 mb-1" key={createUniqueKey()}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">{personalInfo?.name || "Your Name"}</h1>
          <p className="text-xl opacity-90 mb-4">{personalInfo?.title || "Your Title"}</p>
          
          {/* Contact info in columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {personalInfo?.email && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Email:</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Phone:</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Location:</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">Website:</span>
                <span>{personalInfo.website}</span>
              </div>
            )}
            {personalInfo?.socialMedia?.linkedin && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">LinkedIn:</span>
                <span>LinkedIn</span>
              </div>
            )}
            {personalInfo?.socialMedia?.github && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">GitHub:</span>
                <span>GitHub</span>
              </div>
            )}
          </div>
        </div>
      </header>
    );

    sections.push({
      type: 'header',
      content: headerContent,
      canSplit: false,
      isHeader: true,
      isFullWidth: true
    });

    // Summary Section
    if (summary) {
      const summaryContent = (
        <section className="mb-8" key={createUniqueKey()}>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-resume-purple mr-2"></div>
            <h2 className="text-xl font-bold">Professional Summary</h2>
          </div>
          <p className="text-gray-700">{summary}</p>
        </section>
      );

      sections.push({
        type: 'summary',
        content: summaryContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Experience Section (splittable)
    if (experience && experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const expContent = (
            <div key={index} className="mb-5 border-l-2 border-gray-200 pl-4 pb-2">
              <h3 className="font-bold text-lg text-resume-purple">{exp.title || "Job Title"}</h3>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{exp.company || "Company"}</span>
                <span className="text-sm text-gray-600">
                  {exp.startDate || "Start Date"} - {exp.current ? "Present" : exp.endDate || "End Date"}
                </span>
              </div>
              {exp.location && <p className="text-sm text-gray-600 mb-2">{exp.location}</p>}
              <div className="text-sm">{formatDescription(exp.description)}</div>
            </div>
          );
          
          const height = await measureElement(expContent, false);
          return { element: expContent, height };
        })
      );

      const experienceHeader = (
        <section className="mb-3" key={createUniqueKey()}>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-resume-purple mr-2"></div>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </div>
        </section>
      );

      sections.push({
        type: 'experience',
        content: experienceHeader,
        items: experienceItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Education Section (splittable)
    if (education && education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const eduContent = (
            <div key={index} className="mb-4 border-l-2 border-gray-200 pl-4">
              <h3 className="font-bold text-resume-purple">{edu.degree || "Degree"}</h3>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{edu.school || "School"}</span>
                <span className="text-sm text-gray-600">
                  {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                </span>
              </div>
              {edu.location && <p className="text-sm text-gray-600 mb-1">{edu.location}</p>}
              {edu.description && <p className="text-sm">{edu.description}</p>}
            </div>
          );
          
          const height = await measureElement(eduContent, false);
          return { element: eduContent, height };
        })
      );

      const educationHeader = (
        <section className="mb-8" key={createUniqueKey()}>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-resume-purple mr-2"></div>
            <h2 className="text-xl font-bold">Education</h2>
          </div>
        </section>
      );

      sections.push({
        type: 'education',
        content: educationHeader,
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Two-column container for Skills, Certifications, and References
    const twoColumnContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={createUniqueKey()}>
        {/* Skills Column */}
        {skills && skills.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-resume-purple mr-2"></div>
              <h2 className="text-xl font-bold">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div key={skill} className="bg-gray-100 rounded-full px-3 py-1 text-sm mb-2">
                  <span>{skill}</span>
                  {skillLevels?.[skill] && (
                    <div className="mt-1 flex justify-center">
                      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((level) => (
                        <span
                          key={level}
                          className={`inline-block w-1 h-1 mx-0.5 rounded-full ${
                            level <= skillLevels[skill] ? "bg-resume-purple" : "bg-gray-300"
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

        {/* Right Column - Certifications & References */}
        <div className="space-y-8">
          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-resume-purple mr-2"></div>
                <h2 className="text-xl font-bold">Certifications</h2>
              </div>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-2">
                  <p className="font-semibold">{cert.name || "Certification Name"}</p>
                  <p className="text-sm text-gray-600">{cert.issuer || "Issuer"} • {cert.date || "Date"}</p>
                </div>
              ))}
            </section>
          )}

          {/* References */}
          {referees && referees.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-resume-purple mr-2"></div>
                <h2 className="text-xl font-bold">References</h2>
              </div>
              {referees.map((referee, index) => (
                <div key={index} className="mb-3">
                  <p className="font-semibold">{referee.name || "Name"}</p>
                  <p className="text-sm">{referee.position || "Position"} at {referee.company || "Company"}</p>
                  <p className="text-sm text-gray-600">
                    {referee.email} {referee.phone && `• ${referee.phone}`}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );

    sections.push({
      type: 'two-column',
      content: twoColumnContent,
      canSplit: false,
      isMainColumn: true
    });

    return sections;
  }, [data, measureElement]);

  // splitContentIntoPages function - USE PROVEN LOGIC
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const pageContent = (
        <div className="resume-page font-display text-gray-800 mx-auto" style={{ width: '100%', height: '100%' }}>
          {hasHeader && sections.find(s => s.isHeader)?.content}
          <div 
            className="max-w-4xl mx-auto px-6"
            style={{
              padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
            }}
          >
            {mainContent}
          </div>
        </div>
      );

      newPages.push({
        main: pageContent,
        sidebar: null,
        key: `page-${pageNumber}`
      });
      pageNumber++;
    };

    // Process main content sections
    const mainSections = sections.filter(section => section.isMainColumn || section.isFullWidth || section.isHeader);
    
    for (const section of mainSections) {
      if (section.isHeader) continue;
      
      if (section.canSplit && section.items) {
        // Splittable section handling (experience, education)
        const sectionHeader = section.content;
        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          // Use conservative threshold with buffer
          const heightWithBuffer = itemHeight * 1.05;

          if (currentMainHeight + heightWithBuffer > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
            addPage([...currentMainContent], isFirstPage);
            currentMainContent = [];
            currentMainHeight = 0;
            isFirstPage = false;
            
            if (index > 0) {
              currentMainContent.push(sectionHeader);
              currentMainHeight += headerHeight;
            }
          }

          currentMainContent.push(...itemWithHeader);
          currentMainHeight += itemHeight;
        }
      } else {
        // Non-splittable section handling
        const sectionHeight = await measureElement(section.content, false);
        const heightWithBuffer = sectionHeight * 1.05;

        if (currentMainHeight + heightWithBuffer > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          addPage([...currentMainContent], isFirstPage);
          currentMainContent = [];
          currentMainHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(section.content);
        currentMainHeight += sectionHeight;
      }
    }

    // Add final page
    if (currentMainContent.length > 0) {
      addPage(currentMainContent, isFirstPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT, measureElement, margin.top, margin.right, margin.bottom, margin.left]);

  // useEffect for splitContentIntoPages
  useEffect(() => {
    let isMounted = true;
    
    const executeSplit = async () => {
      await splitContentIntoPages();
    };

    if (isMounted) {
      executeSplit();
    }

    return () => {
      isMounted = false;
    };
  }, [splitContentIntoPages]);

  // Loading state
  if (isMeasuring || pages.length === 0) {
    return (
      <div className="template-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ 
          position: 'absolute', 
          left: -9999, 
          top: -9999,
          width: `${A4_WIDTH}px`,
          fontFamily: 'display'
        }} />
      </div>
    );
  }

  // Final render
  return (
    <div className="template-container highlight-template">
      <div ref={measurementRef} style={{ 
        position: 'absolute', 
        left: -9999, 
        top: -9999,
        width: `${A4_WIDTH}px`,
        fontFamily: 'display'
      }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default HighlightTemplateNew;