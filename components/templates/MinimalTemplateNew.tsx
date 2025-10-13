import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import "./styles/minimalist.css"

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const MinimalistTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const margin = useMemo(() => {
    const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
    return { ...defaultMargins, ...margins };
  }, [margins]);

  // Calculate heights and widths
  const CONTENT_MAX_HEIGHT_MARGIN = A4_HEIGHT - 80 - (margin.top + margin.bottom);

  // Measurement function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // console.log(`Creating content sections: ${createUniqueKey()}`);
    const sections: ContentSection[] = [];
    const { personalInfo, summary, experience, education, skills, certifications, referees } = data;

    // Header section
    const headerContent = (
      <header className="mb-8 text-center" key={createUniqueKey()}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">{personalInfo.name}</h1>
        <p className="text-xl text-gray-600 mb-3">{personalInfo.title}</p>
        
        {/* Contact details in a single row */}
        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>

        {/* Social media */}
        {(personalInfo.socialMedia.linkedin || personalInfo.socialMedia.twitter || personalInfo.socialMedia.github) && (
          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
            {personalInfo.socialMedia.linkedin && <span>LinkedIn</span>}
            {personalInfo.socialMedia.twitter && <span>Twitter</span>}
            {personalInfo.socialMedia.github && <span>GitHub</span>}
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

    // Summary section
    if (summary) {
      const summaryContent = (
        <section className="mb-8" key={createUniqueKey()}>
          <p className="text-center">{summary}</p>
        </section>
      );

      sections.push({
        type: 'summary',
        content: summaryContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Experience section (splittable)
    if (experience.length > 0) {
      const experienceItems = await Promise.all(
        experience.map(async (exp, index) => {
          const expContent = (
            <div key={`${index}-${createUniqueKey()}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                <h3 className="font-medium">{exp.title} • {exp.company}</h3>
                <span className="text-gray-600 text-sm">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.location && <p className="text-sm text-gray-600 mb-1">{exp.location}</p>}
              <div className="text-sm mt-1">{formatDescription(exp.description)}</div>
            </div>
          );
          
          const height = await measureElement(expContent, false);
          return { element: expContent, height };
        })
      );

      const experienceHeader = (
        <section key={createUniqueKey()}>
          <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Experience</h2>
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

    // Education section (splittable)
    if (education.length > 0) {
      const educationItems = await Promise.all(
        education.map(async (edu, index) => {
          const eduContent = (
            <div key={`${index}-${createUniqueKey()}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                <h3 className="font-medium">{edu.degree} • {edu.school}</h3>
                <span className="text-gray-600 text-sm">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              {edu.location && <p className="text-sm text-gray-600 mb-1">{edu.location}</p>}
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
          );
          
          const height = await measureElement(eduContent, false);
          return { element: eduContent, height };
        })
      );

      const educationHeader = (
        <section key={createUniqueKey()}>
          <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Education</h2>
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

    // Skills section
    if (skills.length > 0) {
      const skillsContent = (
        <section className="mb-8" key={createUniqueKey()}>
          <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Skills</h2>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {skills.map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-1 text-sm border border-gray-200 rounded-full"
              >
                {skill}
              </span>
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
    }

    // Certifications section
    if (certifications.length > 0) {
      const certificationsContent = (
        <section className="mb-8" key={createUniqueKey()}>
          <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">Certifications</h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="text-sm text-center">
                <span className="font-medium">{cert.name}</span> • {cert.issuer} • {cert.date}
              </div>
            ))}
          </div>
        </section>
      );

      sections.push({
        type: 'certifications',
        content: certificationsContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // References section
    if (referees.length > 0) {
      const referencesContent = (
        <section className="mb-8" key={createUniqueKey()}>
          <h2 className="text-xl font-semibold mb-4 text-center uppercase tracking-wider">References</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {referees.map((referee, index) => (
              <div key={index} className="text-sm text-center">
                <h3 className="font-medium">{referee.name}</h3>
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
  }, [data, measureElement]);

  // splitContentIntoPages function - USE PROVEN LOGIC
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    // console.log(`testing rendering: ${createUniqueKey()}`)
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const pageContent = (
        <div className="minimalist-content font-sans text-gray-800 mx-auto" style={{ width: '100%', height: '100%' }}>
          <div className="p-8" style={{
            padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
          }}>
            {hasHeader && sections.find(s => s.isHeader)?.content}
            <div className="space-y-8">
              {mainContent}
            </div>
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
  }, [createContentSections, CONTENT_MAX_HEIGHT_MARGIN, margin.top, margin.right, margin.bottom, margin.left, measureElement]);

  // useEffect for splitContentIntoPages
  useEffect(() => {
    let isMounted = true;
    
    const executeSplit = async () => {
      if (isMounted) {
        await splitContentIntoPages();
      }
    };

    executeSplit();

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
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  // Final render
  return (
    <div className="template-container minimalist-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default MinimalistTemplateNew;