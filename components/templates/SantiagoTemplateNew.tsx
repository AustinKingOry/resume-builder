/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server"
import "./styles/santiago.css"

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
      <ul className="list-disc ml-4">
        {listItems.map((item, index) => (
          <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
        ))}
      </ul>
    )
  }
  return <p>{description}</p>
}

const createUniqueKey = () => {
  return Math.random().toString(36).substring(7);
}

export const SantiagoTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const margin = useMemo(() => {
    const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
    return { ...defaultMargins, ...margins };
  }, [margins]);

  // Calculate heights and widths
  const CONTENT_MAX_HEIGHT_MARGIN = A4_HEIGHT - 150 - (margin.top + margin.bottom);

  // Helper function to get skill level text
  const getSkillLevelText = useCallback((skill: string) => {
    if (!data.skillLevels || !data.skillLevels[skill]) return "Expert"
    return data.skillLevels[skill]
  }, [data.skillLevels])

  // Measurement function
  const measureElement = useCallback((element: React.ReactElement | React.ReactNode, isSidebar: boolean = false): Promise<number> => {
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
        tempDiv.innerHTML = renderToString(element as React.ReactElement);
        const height = tempDiv.offsetHeight;
        container.removeChild(tempDiv);
        resolve(height);
      };

      setTimeout(measureContent, 0);
    });
  }, []);

  // createContentSections function - MAP ORIGINAL TEMPLATE SECTIONS HERE
  const createContentSections = useCallback(async (): Promise<ContentSection[]> => {
    const sections: ContentSection[] = [];
    
    // Header section
    const headerContent = (
      <header className="text-center mb-6" key={createUniqueKey()}>
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
          {data.personalInfo?.name || "Your Name"}
        </h1>
        <p className="text-gray-700 mb-2 font-semibold">{data.personalInfo?.title || "Your Title"}</p>
        <p className="text-gray-700 text-sm mb-4">{data.personalInfo?.location || "Your Location"}</p>

        <div className="flex justify-between items-center border-b border-gray-300 py-2">
          <p className="text-gray-700 font-semibold">{data.personalInfo?.phone || "Your Phone Number"}</p>
          <p className="text-gray-700 font-semibold">{data.personalInfo?.email || "your.email@example.com"}</p>
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

    // Profile section
    const profileContent = (
      <section className="mb-3 pb-3 border-b border-ddouble border-gray-300" key={createUniqueKey()}>
        <div className="mb-4 py-1 bg-gray-100">
            <h2 className="text-center font-bold uppercase py-0.5 border-b-2 border-gray-700 w-fit mx-auto">Profile</h2>
        </div>
        <p className="text-gray-700 text-center">{data.summary || "Your professional summary goes here."}</p>
      </section>
    );

    sections.push({
      type: 'profile',
      content: profileContent,
      canSplit: false,
      isMainColumn: true
    });

    // Employment History section (splittable)
    const experienceItems = await Promise.all(
      (data.experience || []).map(async (exp, index) => {
        const expContent = (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">◆</span>
              <h3 className="font-bold text-gray-800">
                {exp.title || "Job Title"}, {exp.company || "Company"}
              </h3>
              <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
              <div className="text-right pt-3">
                <p className="text-gray-700 text-sm">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
                <p className="text-gray-700 text-sm">{exp.location || "Location"}</p>
              </div>
            </div>
            {formatDescription(exp.description)}
          </div>
        );
        
        const height = await measureElement(expContent, false);
        return { element: expContent, height };
      })
    );

    const experienceHeader = (
      <section className="mb-4 py-1 bg-gray-100" key={createUniqueKey()}>
        <h2 className="text-center font-bold uppercase py-0.5 border-b-2 border-gray-700 w-fit mx-auto">Employment History</h2>
      </section>
    );

    sections.push({
      type: 'experience',
      content: experienceHeader,
      items: experienceItems,
      canSplit: true,
      isMainColumn: true
    });

    // Education section (splittable)
    const educationItems = await Promise.all(
      (data.education || []).map(async (edu, index) => {
        const eduContent = (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">◆</span>
              <h3 className="font-bold text-gray-800">{edu.school || "School"}</h3>
              <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
              <div className="text-right pt-3">
                <p className="text-gray-700 text-sm">
                  {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
                </p>
                <p className="text-gray-700 text-sm">{edu.location || "Location"}</p>
              </div>
            </div>
            <p className="text-gray-700 italic ml-2">{edu.degree || "Degree"}</p>
            {edu.description && <p className="text-gray-700 ml-2">{edu.description}</p>}
          </div>
        );
        
        const height = await measureElement(eduContent, false);
        return { element: eduContent, height };
      })
    );

    const educationHeader = (
      <section className="mb-4 py-1 bg-gray-100" key={createUniqueKey()}>
        <h2 className="text-center font-bold uppercase py-0.5 border-b-2 border-gray-700 w-fit mx-auto">Education</h2>
      </section>
    );

    sections.push({
      type: 'education',
      content: educationHeader,
      items: educationItems,
      canSplit: true,
      isMainColumn: true
    });

    // Skills section
    const skillsContent = (
      <section className="mb-6" key={createUniqueKey()}>
        <div className="mb-4 py-1 bg-gray-100">
            <h2 className="text-center font-bold uppercase py-0.5 border-b-2 border-gray-700 w-fit mx-auto">Skills</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {(data.skills || []).map((skill, index) => (
            <div key={index} className="flex justify-between">
              <p className="text-gray-800">{skill}</p>
              <div className="flex-grow border-b border-dotted border-gray-400 mx-2"></div>
              <p className="text-gray-700 italic">{getSkillLevelText(skill)}</p>
            </div>
          ))}
        </div>
      </section>
    );

    sections.push({
      type: 'skills',
      content: skillsContent,
      canSplit: false,
      isMainColumn: true
    });

    // Certifications section (conditionally added)
    if (data.certifications && data.certifications.length > 0) {
      const certificationItems = await Promise.all(
        data.certifications.map(async (cert, index) => {
          const certContent = (
            <div key={`${index}-${createUniqueKey()}`} className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-gray-700 mr-2">◆</span>
                <h3 className="font-bold text-gray-800">{cert.name}</h3>
                <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
                <p className="text-gray-700 text-sm">{cert.date} - {cert.expiry}</p>
              </div>
              <p className="text-gray-700 text-sm ml-2">{cert.issuer}</p>
            </div>
          );
          
          const height = await measureElement(certContent, false);
          return { element: certContent, height };
        })
      );

      const certificationsHeader = (
        <section className="mb-4 py-1 bg-gray-100" key={createUniqueKey()}>
          <h2 className="text-center font-bold uppercase py-0.5 border-b-2 border-gray-700 w-fit mx-auto">Certifications</h2>
        </section>
      );

      sections.push({
        type: 'certifications',
        content: certificationsHeader,
        items: certificationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // References section (conditionally added)
    if (data.referees && data.referees.length > 0) {
      const referencesContent = (
        <section className="p-0" key={createUniqueKey()}>
            <div className="mb-4 py-1 bg-gray-100">
                <h2 className="text-center font-bold uppercase py-0.5 border-b-2 border-gray-700 w-fit mx-auto">References</h2>
            </div>
            <ul className="ml-4">
                {data.referees.map((referee, index) => (
                <li key={index} className="mb-1 text-gray-700">
                <div className="flex items-center mb-2 w-full">
                  <span className="text-gray-700 mr-2">◆</span>
                  <h3 className="text-gray-800">{referee.name || "School"} • {referee.company}</h3>
                  <div className="flex-grow border-b border-dotted border-gray-400 mx-4"></div>
                  <div className="text-right pt-3">
                    <p className="text-gray-700 text-sm">
                    {referee.email}
                    </p>
                    <p className="text-gray-700 text-sm">{referee.phone}</p>
                  </div>
                </div>
                </li>
                ))}
            </ul>
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
  }, [data, measureElement, getSkillLevelText]);

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
        <div className="santiago-content bg-white font-serif mx-auto" style={{ width: '100%', height: '100%' }}>
          <div style={{
            padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
          }}>
            {hasHeader && sections.find(s => s.isHeader)?.content}
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
          // Splittable section handling (education, experience)
          const sectionHeader = section.content;
          const headerHeight = await measureElement(sectionHeader, false);
  
          for (const [index, item] of section.items.entries()) {
            const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
            const itemHeight = index === 0 ? headerHeight + item.height : item.height;
  
            if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT_MARGIN && currentMainContent.length > 0) {
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
  
          if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT_MARGIN && currentMainContent.length > 0) {
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
  }, [createContentSections, CONTENT_MAX_HEIGHT_MARGIN, measureElement, margin]);

  // useEffect for splitContentIntoPages
  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  // Loading state
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

  // Final render
  return (
    <div className="template-container santiago-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default SantiagoTemplateNew;