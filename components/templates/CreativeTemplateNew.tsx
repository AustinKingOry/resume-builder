/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ResumeData } from "../../lib/types"
import React, { useRef, useEffect, useState, useCallback } from "react";
import "./styles/creative.css";
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

const Page: React.FC<PageProps> = ({ children, pageNumber, totalPages, margins, showFooter }) => (
  <div 
    className="creative-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${pageNumber == 1 ? 0 : margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
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

interface PageContent {
  main: React.ReactNode;
  sidebar: React.ReactNode;
  key: string;
}

interface ContentSection {
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'references';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
  isSidebar?: boolean;
  isFullWidth?: boolean;
}

// Creative template with unique layout and style while maintaining ATS compatibility
export const CreativeTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = true }) => {
  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;
  
  const defaultMargins = { top: 0, right: 0, bottom: 0, left: 0 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available heights
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 40;
  const MAIN_COLUMN_WIDTH = A4_WIDTH * 0.66;
  const SIDEBAR_WIDTH = A4_WIDTH * 0.33;

  // Measure element height
  const measureElement = (element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const container = measurementRef.current;
      const tempDiv = document.createElement('div');
      tempDiv.style.width = isSidebar ? `${SIDEBAR_WIDTH}px` : `${MAIN_COLUMN_WIDTH}px`;
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

    // Header section (full width, only first page)
    const headerElement = (
      <div key="header" className="bg-resume-teal py-8 px-10 text-white mb-8">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.name}</h1>
        <p className="text-xl opacity-90">{personalInfo.title}</p>
        
        <div className="h-0.5 bg-white/30 my-4"></div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-between">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
        </div>
        
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="flex gap-4 mt-4">
            {personalInfo.socialMedia.linkedin && <span className="text-white/90 text-sm">LinkedIn</span>}
            {personalInfo.socialMedia.github && <span className="text-white/90 text-sm">GitHub</span>}
            {personalInfo.socialMedia.twitter && <span className="text-white/90 text-sm">Twitter</span>}
            {personalInfo.website && <span className="text-white/90 text-sm">{personalInfo.website}</span>}
          </div>
        )}
      </div>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isHeader: true
    });

    // Summary section (main column)
    if (summary) {
      const summaryElement = (
        <section key="summary" className="mb-8 col-span-3"> {/* Span all columns */}
          <h2 className="text-2xl font-bold mb-3 text-resume-teal">About Me</h2>
          <p className="leading-relaxed">{summary}</p>
        </section>
      );
      sections.push({
        type: 'summary',
        content: summaryElement,
        canSplit: false,
        isFullWidth: true // Add this flag
      });
    }

    // Experience sections (main column)
    if (experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const experienceElement = (
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
          );

          return {
            element: experienceElement,
            height: await measureElement(experienceElement, false),
            data: exp
          };
        })
      );

      sections.push({
        type: 'experience',
        content: (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-resume-teal">Experience</h2>
            <div className="space-y-6">
              {experienceItems.map(item => item.element)}
            </div>
          </section>
        ),
        items: experienceItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Education sections (main column)
    if (education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const educationElement = (
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
          );

          return {
            element: educationElement,
            height: await measureElement(educationElement, false),
            data: edu
          };
        })
      );

      sections.push({
        type: 'education',
        content: (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-resume-teal">Education</h2>
            <div className="space-y-4">
              {educationItems.map(item => item.element)}
            </div>
          </section>
        ),
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Skills section (sidebar)
    if (skills.length > 0) {
      const skillsElement = (
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
      );
      sections.push({
        type: 'skills',
        content: skillsElement,
        canSplit: false,
        isSidebar: true
      });
    }

    // Certifications section (sidebar)
    if (certifications.length > 0) {
      const certificationsElement = (
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
      );
      sections.push({
        type: 'certifications',
        content: certificationsElement,
        canSplit: false,
        isSidebar: true
      });
    }

    // References section (sidebar)
    if (referees.length > 0) {
      const referencesElement = (
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
      );
      sections.push({
        type: 'references',
        content: referencesElement,
        canSplit: false,
        isSidebar: true
      });
    }

    return sections;
  }, [personalInfo, summary, experience, education, skills, skillLevels, certifications, referees]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    const currentSidebarHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    const currentSidebarContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;
    

  // Process sidebar content once and store it
  const sidebarSections = sections.filter(section => section.isSidebar);
  const allSidebarContent: React.ReactNode[] = [];
  let totalSidebarHeight = 0;
  
  for (const section of sidebarSections) {
    const sectionHeight = await measureElement(section.content, true);
    allSidebarContent.push(section.content);
    totalSidebarHeight += sectionHeight;
  }

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false, pageSidebarContent: React.ReactNode[] = []) => {
      // Separate full-width content from regular main content
      const fullWidthContent = mainContent.filter((item) => {
        if (!React.isValidElement(item)) return false
        const el = item as React.ReactElement<{ className?: string }>
        return el.props.className?.includes("col-span-3")
      })
    
      const regularMainContent = mainContent.filter((item) => {
        if (!React.isValidElement(item)) return true
        const el = item as React.ReactElement<{ className?: string }>
        return !el.props.className?.includes("col-span-3")
      })
    
      const content = (
        <div className="resume-page font-display text-gray-800 bg-white" style={{ height: '100%', overflow: 'hidden' }}>
          {hasHeader && sections.find(s => s.isHeader)?.content}
          <div className="px-10" style={{ height: 'calc(100% - 80px)', overflow: 'hidden' }}>
            {/* Full-width content */}
            {fullWidthContent.length > 0 && (
              <div className="mb-8">
                {fullWidthContent}
              </div>
            )}
            
            {/* Two-column content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ 
              height: fullWidthContent.length > 0 ? 'calc(100% - 120px)' : '100%', 
              overflow: 'hidden' 
            }}>
              <div className="col-span-2" style={{ height: '100%', overflow: 'hidden' }}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                  {regularMainContent}
                </div>
              </div>
              <div style={{ height: '100%', overflow: 'hidden' }}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                  {pageSidebarContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
      newPages.push({
        main: content,
        sidebar: <></>,
        key: `page-${pageNumber}`
      });
      pageNumber++;
      isFirstPage = false;
    };
    

    // Separate main and sidebar content
    const mainSections = sections.filter(section => section.isMainColumn || section.isFullWidth || section.isHeader);
    // const sidebarSections = sections.filter(section => section.isSidebar);

    // Process sidebar content FIRST and include it from the beginning
    // for (const section of sidebarSections) {
    //   const sectionHeight = await measureElement(section.content, true);
    //   currentSidebarContent.push(section.content);
    //   currentSidebarHeight += sectionHeight;
    // }
    // Process main content
    for (const section of mainSections) {
      if (section.isHeader) {
        // Header is handled separately in addPage
        continue;
      }
      if (section.isFullWidth) {
        const sectionHeight = await measureElement(section.content, false);
  
        const fullWidthContent = (
          <div key={`fullwidth-${section.type}`} className="col-span-3">
            {section.content}
          </div>
        );
        
        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
          addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
          currentMainContent = [];
          // currentSidebarContent = [];
          currentMainHeight = 0;
          // currentSidebarHeight = 0;
          isFirstPage = false;
        }
        
        
        currentMainContent.push(fullWidthContent);
        currentMainHeight += sectionHeight;
        continue;
      }
      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="text-2xl font-bold mb-4 text-resume-teal">
            {section.type === 'experience' && 'Experience'}
            {section.type === 'education' && 'Education'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
            const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
            addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
            currentMainContent = [];
            // currentSidebarContent = [];
            currentMainHeight = 0;
            // currentSidebarHeight = 0;
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
        const sectionHeight = await measureElement(section.content, false);

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
          addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
          currentMainContent = [];
          // currentSidebarContent = [];
          currentMainHeight = 0;
          // currentSidebarHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(section.content);
        currentMainHeight += sectionHeight;
      }
    }

    // // Process sidebar content
    // for (const section of sidebarSections) {
    //   const sectionHeight = await measureElement(section.content, true);

    //   // if (currentSidebarHeight + sectionHeight > CONTENT_MAX_HEIGHT) {
    //   //   // If sidebar content doesn't fit, it will continue on next page
    //   //   currentSidebarHeight = 0;
    //   // }

    //   currentSidebarContent.push(section.content);
    //   currentSidebarHeight += sectionHeight;
    // }

    // Add the last page
    if (currentMainContent.length > 0 || currentSidebarContent.length > 0) {
      const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
      addPage(currentMainContent, isFirstPage, sidebarForThisPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="creative-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="creative-container creative-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      
      {pages.map((page, index) => (
        <Page 
          key={page.key}
          pageNumber={index + 1} 
          totalPages={pages.length}
          margins={margin}
          showFooter={showFooter}
        >
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default CreativeTemplateNew;