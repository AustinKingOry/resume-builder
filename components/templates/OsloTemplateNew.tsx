import Image from "next/image"
import type { ResumeData } from "../../lib/types"
import { useRef, useEffect, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import "./styles/oslo.css"

// Helper component for skill progress bars
const SkillProgressBar = ({ level = 90 }: { level?: number }) => {
  return (
    <div className="w-full bg-gray-200 h-2 mt-1 mb-4 rounded-full overflow-hidden">
      <div className="bg-gray-800 h-full rounded-full" style={{ width: `${level}%` }} />
    </div>
  )
}

const formatDescription = (description: string | undefined) => {
    if (!description) return null
    const listItems = description.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
    if (listItems.length > 0) {
      return (
        <ul className="list-disc list-inside text-gray-700">
          {listItems.map((item, index) => (
            <li key={index}>{item.replace(/^[-*]\s*/, "")}</li>
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
    className="oslo-page a4-page" 
    style={{ 
      width: `${A4_WIDTH}px`, 
      height: `${A4_HEIGHT}px`,
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
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
  type: 'header' | 'contactBar' | 'profile' | 'experience' | 'education' | 'skills' | 'references';
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  canSplit?: boolean;
  isHeader?: boolean;
  isMainColumn?: boolean;
}

export default function OsloTemplateNew({ data, margins = {}, showFooter = false }: TemplateProps) {
  const resumeData = data;
  
  const defaultMargins = { top: 0, right: 0, bottom: 0, left: 0 };
  const margin = { ...defaultMargins, ...margins };
  
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  // Calculate available height considering footer
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - 40;

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
        tempDiv.innerHTML = renderToString(element as React.ReactElement);
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
      <header key="header" className="bg-gray-800 text-white py-8 px-6 text-center">
        {resumeData.personalInfo?.photo && (
          <div className="flex justify-center mb-4">
            <Image
              src={resumeData.personalInfo.photo || "/placeholder.svg"}
              alt={resumeData.personalInfo.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-white"
              width={96}
              height={96}
            />
          </div>
        )}
        <h1 className="text-3xl font-light">{resumeData.personalInfo?.name || "Your Name"}</h1>
        <p className="text-sm uppercase tracking-wider mt-1">{resumeData.personalInfo?.title || "Your Title"}</p>
      </header>
    );
    sections.push({
      type: 'header',
      content: headerElement,
      canSplit: false,
      isHeader: true
    });

    // Contact Bar section (full width, only first page)
    const contactBarElement = (
      <div key="contactBar" className="bg-gray-700 text-white py-2 px-6 flex justify-center space-x-8 text-sm">
        {resumeData.personalInfo?.email && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{resumeData.personalInfo.email}</span>
          </div>
        )}
        {resumeData.personalInfo?.location && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{resumeData.personalInfo.location}</span>
          </div>
        )}
        {resumeData.personalInfo?.phone && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{resumeData.personalInfo.phone}</span>
          </div>
        )}
      </div>
    );
    sections.push({
      type: 'contactBar',
      content: contactBarElement,
      canSplit: false,
      isHeader: true
    });

    // Profile section
    if (resumeData.summary) {
      const profileElement = (
        <section key="profile" className="mb-8">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </section>
      );
      sections.push({
        type: 'profile',
        content: profileElement,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Experience sections
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceItems = await Promise.all(
        resumeData.experience.map(async (exp, index) => {
          const experienceElement = (
            <div key={index} className="mb-6 experience-item">
              <div className="mb-2">
                <h3 className="font-bold text-gray-800">
                  {exp.title || "Job Title"}, {exp.company || "Company"}, {exp.location || "Location"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
                </p>
              </div>
              {formatDescription(exp.description)}
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
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Employment History</h2>
            {experienceItems.map(item => item.element)}
          </section>
        ),
        items: experienceItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Education sections
    if (resumeData.education && resumeData.education.length > 0) {
      const educationItems = await Promise.all(
        resumeData.education.map(async (edu, index) => {
          const educationElement = (
            <div key={index} className="mb-4 education-item">
              <h3 className="font-bold text-gray-800">
                {edu.degree || "Degree"}, {edu.school || "School"}, {edu.location || "Location"}
              </h3>
              <p className="text-gray-600 text-sm">
                {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
              </p>
              {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
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
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Education</h2>
            {educationItems.map(item => item.element)}
          </section>
        ),
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
        const uniqueKey = new Date().getTime().toString();
      const skillsElement = (
        <section key={`skill-${uniqueKey}`} className="mb-8">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index}>
                <p className="text-gray-800">{skill}</p>
                <SkillProgressBar
                  level={resumeData.skillLevels?.[skill]  || 70}
                />
              </div>
            ))}
          </div>
        </section>
      );
      sections.push({
        type: 'skills',
        content: skillsElement,
        canSplit: false,
        isMainColumn: true
      });
    }

    // References section
    if (resumeData.referees && resumeData.referees.length > 0) {
      const referencesElement = (
        <section>
          <h2 className="text-xl font-bold mb-4">References</h2>
          <p className="text-gray-700">Available upon request</p>
        </section>
      );
      sections.push({
        type: 'references',
        content: referencesElement,
        canSplit: false,
        isMainColumn: true
      });
    }

    return sections;
  }, [resumeData]);

  // Split content into pages based on measured heights
  const splitContentIntoPages = useCallback(async () => {
    const sections = await createContentSections();
    const newPages: PageContent[] = [];
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const content = (
        <div className="oslo-content bg-white font-sans mx-auto" style={{ height: '100%', overflow: 'hidden' }}>
          {hasHeader && (
            <div>
              {sections.find(s => s.type === 'header')?.content}
              {sections.find(s => s.type === 'contactBar')?.content}
            </div>
          )}
          <div className="p-8" style={{ 
            height: hasHeader ? 'calc(100% - 180px)' : 'calc(100% - 50px)',
            overflow: 'hidden'
          }}>
            {mainContent}
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

    // Process all sections
    const mainSections = sections.filter(section => section.isMainColumn);

    for (const section of mainSections) {
      // Skip header sections after first page
      if (section.isHeader && !isFirstPage) {
        continue;
      }

      if (section.canSplit && section.items) {
        const sectionHeader = (
          <h2 key={`${section.type}-header`} className="text-xl font-bold mb-4">
            {section.type === 'experience' && 'Employment History'}
            {section.type === 'education' && 'Education'}
          </h2>
        );

        const headerHeight = await measureElement(sectionHeader);

        for (const [index, item] of section.items.entries()) {
          const itemWithHeader = index === 0 ? [sectionHeader, item.element] : [item.element];
          const itemHeight = index === 0 ? headerHeight + item.height : item.height;

          if (currentMainHeight + itemHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
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
        const sectionHeight = await measureElement(section.content);

        if (currentMainHeight + sectionHeight > CONTENT_MAX_HEIGHT && currentMainContent.length > 0) {
          addPage([...currentMainContent], isFirstPage);
          currentMainContent = [];
          currentMainHeight = 0;
          isFirstPage = false;
        }

        currentMainContent.push(section.content);
        currentMainHeight += sectionHeight;
      }
    }

    // Add the last page if it has content
    if (currentMainContent.length > 0) {
      addPage(currentMainContent, isFirstPage);
    }

    setPages(newPages);
    setIsMeasuring(false);
  }, [createContentSections, CONTENT_MAX_HEIGHT]);

  useEffect(() => {
    splitContentIntoPages();
  }, [splitContentIntoPages]);

  if (isMeasuring || pages.length === 0) {
    return (
      <div className="oslo-container">
        <div className="flex items-center justify-center" style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}>
          <div className="text-gray-500">Generating resume pages...</div>
        </div>
        <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      </div>
    );
  }

  return (
    <div className="oslo-container oslo-template">
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
}