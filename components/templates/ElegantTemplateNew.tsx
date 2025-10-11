/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import type { ResumeData } from "../../lib/types";

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

const formatDescription = (description: string | undefined) => {
  if (!description) return null;
  const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"));
  if (listItems.length > 0) {
    return (
      <ul className="list-disc ml-5">
        {listItems.map((item, index) => (
          <li key={index} className="text-gray-800 mb-1">
            {item.replace(/^[-*]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  }
  return <p>{description}</p>;
};

// Page Component (USE AS-IS)
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

export const ElegantTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = true }) => {
  // 1. Destructure data and set up state
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // 2. Calculate heights and widths
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - (margins.top || 40) - (margins.bottom || 40);
  const MAIN_COLUMN_WIDTH = A4_WIDTH * 0.66;
  const SIDEBAR_WIDTH = A4_WIDTH * 0.33;

  const { personalInfo, summary, experience, education, skills, skillLevels, certifications, referees } = data;

  // 3. Measurement function (USE AS-IS)
  const measureElement = (element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
    return new Promise((resolve) => {
      if (!measurementRef.current) {
        resolve(0);
        return;
      }

      const measureDiv = document.createElement('div');
      measureDiv.style.position = 'absolute';
      measureDiv.style.left = '-9999px';
      measureDiv.style.top = '-9999px';
      measureDiv.style.width = isSidebar ? `${SIDEBAR_WIDTH}px` : `${MAIN_COLUMN_WIDTH}px`;
      
      // For full-width elements, use full width
      if (
        React.isValidElement(element) &&
        (element as React.ReactElement<{ className?: string }>).props.className?.includes("col-span-3")
      ) {
        measureDiv.style.width = `${A4_WIDTH}px`;
      }

      measurementRef.current.appendChild(measureDiv);

      // Create a wrapper to render the element
      const wrapper = document.createElement('div');
      wrapper.className = 'font-serif text-gray-800 p-10';
      measureDiv.appendChild(wrapper);

      // Use React to render the element temporarily
      const tempDiv = document.createElement('div');
      wrapper.appendChild(tempDiv);

      setTimeout(() => {
        const height = wrapper.offsetHeight;
        measurementRef.current?.removeChild(measureDiv);
        resolve(height);
      }, 100);
    });
  };

  // 4. createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS HERE
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];
    
    // Header section - full width
    const headerContent = (
      <header className="mb-8 text-center border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold tracking-wide mb-1">{personalInfo.name}</h1>
        <p className="text-xl mb-3 text-gray-700">{personalInfo.title}</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
        
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="flex justify-center gap-6 mt-2 text-sm">
            {personalInfo.socialMedia.linkedin && <span>LinkedIn</span>}
            {personalInfo.socialMedia.github && <span>GitHub</span>}
            {personalInfo.socialMedia.twitter && <span>Twitter</span>}
          </div>
        )}
      </header>
    );

    sections.push({
      type: 'header',
      content: headerContent,
      canSplit: false,
      isHeader: true,
      isFullWidth: true
    });

    // Summary section - full width
    if (summary) {
      const summaryContent = (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-center">Professional Summary</h2>
          <p className="text-center leading-relaxed italic">{summary}</p>
        </section>
      );

      sections.push({
        type: 'summary',
        content: summaryContent,
        canSplit: false,
        isFullWidth: true
      });
    }

    // Skills section - sidebar
    if (skills.length > 0) {
      const skillsContent = (
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
      );

      sections.push({
        type: 'skills',
        content: skillsContent,
        canSplit: false,
        isSidebar: true
      });
    }

    // Certifications section - sidebar
    if (certifications.length > 0) {
      const certificationsContent = (
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
      );

      sections.push({
        type: 'certifications',
        content: certificationsContent,
        canSplit: false,
        isSidebar: true
      });
    }

    // Experience section - main column (splittable)
    if (experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const itemContent = (
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
          );
          
          const height = await measureElement(itemContent, false);
          return { element: itemContent, height };
        })
      );

      const experienceHeader = (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">Professional Experience</h2>
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

    // Education section - main column (splittable)
    if (education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const itemContent = (
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
          );
          
          const height = await measureElement(itemContent, false);
          return { element: itemContent, height };
        })
      );

      const educationHeader = (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">Education</h2>
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

    // References section - main column
    if (referees.length > 0) {
      const referencesContent = (
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
      );

      sections.push({
        type: 'references',
        content: referencesContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    return sections;
  }, [personalInfo, summary, experience, education, skills, skillLevels, certifications, referees]);

  // 5. splitContentIntoPages function - USE PROVEN LOGIC
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    // Process sidebar content once
    const sidebarSections = sections.filter(section => section.isSidebar);
    const allSidebarContent: React.ReactNode[] = [];
    for (const section of sidebarSections) {
      allSidebarContent.push(section.content);
    }

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false, pageSidebarContent: React.ReactNode[] = []) => {
      const headerSection = sections.find(s => s.isHeader);
      const headerContent = hasHeader && headerSection ? [headerSection.content] : [];
      
      const mainWithHeader = [...headerContent, ...mainContent];
      
      const pageContent = (
        <div className="resume-page font-serif text-gray-800 p-10">
          {pageSidebarContent.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-8">
                {pageSidebarContent}
              </div>
              <div className="col-span-2 space-y-8">
                {mainWithHeader}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {mainWithHeader}
            </div>
          )}
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
      
      if (section.isFullWidth) {
        // Full-width section handling
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
          currentMainHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(fullWidthContent);
        currentMainHeight += sectionHeight;
        continue;
      }

      if (section.canSplit && section.items) {
        // Splittable section handling (experience, education)
        const sectionHeader = section.content;
        const headerHeight = await measureElement(sectionHeader, false);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
            const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
            addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
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

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
          addPage([...currentMainContent], isFirstPage, sidebarForThisPage);
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
      const sidebarForThisPage = isFirstPage ? allSidebarContent : [];
      addPage(currentMainContent, isFirstPage, sidebarForThisPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  // 6. useEffect for splitContentIntoPages
  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  // 7. Loading state
  if (isMeasuring || pages.length === 0) {
    return (
      <div className="template-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  // 8. Final render
  return (
    <div className="template-container">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margins} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

// Required CSS
const elegantTemplateStyles = `
.template-container {
  font-family: 'Times New Roman', serif;
}

.a4-page {
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  position: relative;
}

.page-footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.page-number {
  font-family: 'Times New Roman', serif;
}

@media print {
  .template-container {
    box-shadow: none;
  }
  
  .a4-page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }
  
  .page-footer {
    position: fixed;
    bottom: 20px;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = elegantTemplateStyles;
  document.head.appendChild(styleSheet);
}

export default ElegantTemplateNew;