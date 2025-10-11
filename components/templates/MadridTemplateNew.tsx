/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import type { ResumeData } from "../../lib/types"
import { renderToString } from "react-dom/server";
import "./styles/madrid.css"

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
      <ul className="list-disc list-inside">
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

export const MadridTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate heights and widths
  const CONTENT_MAX_HEIGHT_MARGIN = A4_HEIGHT - 80 - (margin.top + margin.bottom);
//   const CONTENT_MAX_WIDTH = A4_WIDTH - (margin.left + margin.right);

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
      <div className="flex">
        {/* Photo section */}
        <div className="w-1/4">
          {data.personalInfo?.photo ? (
            <Image
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt={data.personalInfo.name}
              className="w-full h-[160px] object-cover"
              width={160}
              height={160}
              unoptimized
            />
          ) : (
            <div className="w-full h-[160px] bg-gray-200"></div>
          )}
        </div>

        {/* Yellow header section */}
        <div className="w-3/4 bg-yellow-300 p-8">
          <h1 className="text-4xl font-bold uppercase">{data.personalInfo?.name || "Your Name"}</h1>
          <p className="mt-1">{data.personalInfo?.title || "Your Title"}</p>
        </div>
      </div>
    );

    sections.push({
      type: 'header',
      content: headerContent,
      canSplit: false,
      isHeader: true,
      isFullWidth: true
    });

    // Details section
    const detailsContent = (
      <div className="mb-8" key={createUniqueKey()}>
        <div className="bg-black text-white px-4 py-1 inline-block mb-4">
          <h2 className="text-sm font-bold uppercase">Details</h2>
        </div>
        <div>
          <p>{data.personalInfo?.location || "Your Address"}</p>
          <p>{data.personalInfo?.email || "your.email@example.com"}</p>
          <p>{data.personalInfo?.phone || "Your Phone Number"}</p>
        </div>
      </div>
    );

    sections.push({
      type: 'details',
      content: detailsContent,
      canSplit: false,
      isMainColumn: true
    });

    // Profile section
    const profileContent = (
      <div className="mb-8" key={createUniqueKey()}>
        <div className="bg-black text-white px-4 py-1 inline-block mb-4">
          <h2 className="text-sm font-bold uppercase">Profile</h2>
        </div>
        <p className="text-gray-800">{data.summary || "Your professional summary goes here."}</p>
      </div>
    );

    sections.push({
      type: 'profile',
      content: profileContent,
      canSplit: false,
      isMainColumn: true
    });

    // Education section (splittable)
    const educationItems = await Promise.all(
      (data.education || []).map(async (edu, index) => {
        const eduContent = (
          <div key={index} className="mb-4">
            <h3 className="font-bold">
              {edu.degree || "Degree"}, {edu.school || "School"}, {edu.location || "Location"}
            </h3>
            <p className="text-gray-600 uppercase text-xs mb-2">
              {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
            </p>
            {edu.description && (
              <ul className="list-disc ml-5">
                <li>{edu.description}</li>
              </ul>
            )}
          </div>
        );
        
        const height = await measureElement(eduContent, false);
        return { element: eduContent, height };
      })
    );

    const educationHeader = (
      <div className="mb-8" key={createUniqueKey()}>
        <div className="bg-black text-white px-4 py-1 inline-block mb-4">
          <h2 className="text-sm font-bold uppercase">Education</h2>
        </div>
      </div>
    );

    sections.push({
      type: 'education',
      content: educationHeader,
      items: educationItems,
      canSplit: true,
      isMainColumn: true
    });

    // Employment History section (splittable)
    const experienceItems = await Promise.all(
      (data.experience || []).map(async (exp, index) => {
        const expContent = (
          <div key={`${index}-${createUniqueKey()}`} className="mb-4">
            <h3 className="font-bold">
              {exp.title || "Job Title"}, {exp.company || "Company"}, {exp.location || "Location"}
            </h3>
            <p className="text-gray-600 uppercase text-xs mb-2">
              {exp.startDate || "Start Date"} — {exp.current ? "Present" : exp.endDate || "End Date"}
            </p>
            {formatDescription(exp.description)}
          </div>
        );
        
        const height = await measureElement(expContent, false);
        return { element: expContent, height };
      })
    );

    const experienceHeader = (
      <div key={createUniqueKey()}>
        <div className="bg-black text-white px-4 py-1 inline-block mb-4">
          <h2 className="text-sm font-bold uppercase">Employment History</h2>
        </div>
      </div>
    );

    sections.push({
      type: 'experience',
      content: experienceHeader,
      items: experienceItems,
      canSplit: true,
      isMainColumn: true
    });

    // Skills section
    const skillsContent = (
      <div className="mb-8" key={createUniqueKey()}>
        <div className="bg-black text-white px-4 py-1 inline-block mb-4">
          <h2 className="text-sm font-bold uppercase">Skills</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(data.skills || []).map((skill, index) => (
            <div key={index} className="mb-2">
              <p>{skill}</p>
              <div className="w-full bg-gray-200 h-2 mt-1">
                <div
                  className="bg-black h-2"
                  style={{
                    width: data.skillLevels?.[skill] ? `${data.skillLevels?.[skill]}%` : "70%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    sections.push({
      type: 'skills',
      content: skillsContent,
      canSplit: false,
      isMainColumn: true
    });

    // Languages section (conditionally added)
    if (data.skills && data.skills.length > 4) {
      const languagesContent = (
        <div className="mb-8" key={createUniqueKey()}>
          <div className="bg-black text-white px-4 py-1 inline-block mb-4">
            <h2 className="text-sm font-bold uppercase">Languages</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(data.skills || []).map((skill, index) => (
              <div key={index} className="mb-2">
                <p>{skill}</p>
                <div className="w-full bg-gray-200 h-2 mt-1">
                  <div
                    className="bg-black h-2"
                    style={{
                      width: data.skillLevels?.[skill] ? `${data.skillLevels?.[skill]}%` : "70%"
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      sections.push({
        type: 'languages',
        content: languagesContent,
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
    
    let currentMainHeight = 0;
    let currentMainContent: React.ReactNode[] = [];
    let pageNumber = 1;
    let isFirstPage = true;

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false, pageSidebarContent: React.ReactNode[] = []) => {
      const pageContent = (
        <div className="madrid-content bg-white font-sans mx-auto" style={{ width: '100%', height: '100%' }}>
          {hasHeader && sections.find(s => s.isHeader)?.content}
          <div className="mt-4"
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
  }, [createContentSections, CONTENT_MAX_HEIGHT_MARGIN, measureElement]);

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
    <div className="template-container madrid-template">
      <div ref={measurementRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};