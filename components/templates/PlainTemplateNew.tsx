"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { ResumeData } from "@/lib/types"
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github } from "lucide-react"
import { renderToString } from "react-dom/server"
import { createUniqueKey } from "@/lib/helpers"
import "./styles/plain.css"
import Image from "next/image"

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

export const PlainTemplateNew: React.FC<TemplateProps> = ({ data, margins = {}, showFooter = false }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const defaultMargins = { top: 32, right: 32, bottom: 32, left: 32 };
  const margin = { ...defaultMargins, ...margins };

  // Calculate available content height
  const HEADER_HEIGHT = 150; // Approximate height of header with photo
  const CONTENT_MAX_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - (margin.top + margin.bottom) - 40;

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const formatDescription = (description: string) => {
    return description.split("\n").map((line, index) => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        return (
          <li key={`${index}-${createUniqueKey()}`} className="ml-4">
            {trimmedLine.substring(1).trim()}
          </li>
        )
      }
      return trimmedLine ? (
        <p key={`${index}-${createUniqueKey()}`} className="mb-2">
          {trimmedLine}
        </p>
      ) : null
    })
  }

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
      
      // Set up measurement container with exact page constraints
      tempDiv.style.width = `${A4_WIDTH}px`;
      tempDiv.style.padding = `0`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.fontFamily = 'sans-serif';
      
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
    const sections: ContentSection[] = [];
    
    // Header section with photo
    const headerContent = (
      <div className="flex items-start gap-6 mb-8" key={createUniqueKey()}>
        {data.personalInfo?.photo && (
          <Image
            src={data.personalInfo.photo || "/placeholder.svg"}
            height={96}
            width={96}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo?.name || "Your Name"}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{data.personalInfo?.title || "Professional Title"}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {data.personalInfo?.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo?.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <a href={data.personalInfo.website} className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2">
            {data.personalInfo?.socialMedia?.linkedin && (
              <a href={data.personalInfo.socialMedia.linkedin} className="text-blue-600 hover:underline">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {data.personalInfo?.socialMedia?.twitter && (
              <a href={data.personalInfo.socialMedia.twitter} className="text-blue-600 hover:underline">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {data.personalInfo?.socialMedia?.github && (
              <a href={data.personalInfo.socialMedia.github} className="text-blue-600 hover:underline">
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
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

    // Professional Summary Section
    if (data.summary) {
      const summaryContent = (
        <div className="mb-4" key={createUniqueKey()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      );

      sections.push({
        type: 'summary',
        content: summaryContent,
        canSplit: false,
        isMainColumn: true
      });
    }

    // Experience Section (splittable)
    if (data.experience && data.experience.length > 0) {
      const experienceItems = await Promise.all(
        data.experience.map(async (exp, index) => {
          const expContent = (
            <div className={index == data.education.length -1 ? "mb-4" : "mb-2"} key={`${index}-${createUniqueKey()}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.title || "Job Title"}</h4>
                  <p className="text-gray-700">{exp.company || "Company"}</p>
                  {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                </div>
                <div className="text-sm text-gray-600 text-right">
                  {formatDate(exp.startDate || "")} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                </div>
              </div>
              {exp.description && (
                <div className="text-gray-700 text-sm">
                  <ul className="list-disc list-outside">{formatDescription(exp.description)}</ul>
                </div>
              )}
            </div>
          );
          
          const height = await measureElement(expContent, false);
          return { element: expContent, height };
        })
      );

      const experienceHeader = (
        <div className="mb-4" key={createUniqueKey()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Work Experience</h3>
        </div>
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
    if (data.education && data.education.length > 0) {
      const educationItems = await Promise.all(
        data.education.map(async (edu, index) => {
          const eduContent = (
            <div className={index == data.education.length -1 ? "mb-4" : "mb-2"} key={`${index}-${createUniqueKey()}`}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.degree || "Degree"}</h4>
                  <p className="text-gray-700">{edu.school || "School"}</p>
                  {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(edu.startDate || "")} - {formatDate(edu.endDate || "")}
                </div>
              </div>
              {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
            </div>
          );
          
          const height = await measureElement(eduContent, false);
          return { element: eduContent, height };
        })
      );

      const educationHeader = (
        <div className="mb-4" key={createUniqueKey()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Education</h3>
        </div>
      );

      sections.push({
        type: 'education',
        content: educationHeader,
        items: educationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // Skills Section - Non-splittable (stays together as one unit)
    if (data.skills && data.skills.length > 0) {
        const skillsContent = (
        <div className="mb-4" key={createUniqueKey()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
                <span key={index} className="text-sm text-gray-700 py-0.5 px-2 border border-gray-300 rounded-md">
                {skill.trim()}
                </span>
            ))}
            </div>
        </div>
        );
    
        sections.push({
        type: 'skills',
        content: skillsContent,
        canSplit: false,  // Skills stay together as one unit
        isMainColumn: true
        });
    }

    // Certifications Section (splittable)
    if (data.certifications && data.certifications.length > 0) {
      const certificationItems = await Promise.all(
        data.certifications.map(async (cert, index) => {
          const certContent = (
            <div className={index == data.education.length -1 ? "mb-4" : "mb-2"} key={`${index}-${createUniqueKey()}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{cert.name || "Certification Name"}</h4>
                  <p className="text-gray-700">{cert.issuer || "Issuer"}</p>
                  {cert.id && <p className="text-sm text-gray-600">ID: {cert.id}</p>}
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <p>{formatDate(cert.date || "")}</p>
                  {cert.expiry && <p>Expires: {formatDate(cert.expiry)}</p>}
                </div>
              </div>
            </div>
          );
          
          const height = await measureElement(certContent, false);
          return { element: certContent, height };
        })
      );

      const certificationsHeader = (
        <div className="mb-4" key={createUniqueKey()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">Certifications</h3>
        </div>
      );

      sections.push({
        type: 'certifications',
        content: certificationsHeader,
        items: certificationItems,
        canSplit: true,
        isMainColumn: true
      });
    }

    // References Section (splittable)
    if (data.referees && data.referees.length > 0) {
      // Group references for better pagination
      const refereeGroups = [];
      const refereesPerGroup = 2; // Two references per group
      
      for (let i = 0; i < data.referees.length; i += refereesPerGroup) {
        refereeGroups.push(data.referees.slice(i, i + refereesPerGroup));
      }

      const referencesItems = await Promise.all(
        refereeGroups.map(async (refereeGroup, groupIndex) => {
          const referencesContent = (
            <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {refereeGroup.map((ref, index) => (
                <div key={`${index}-${createUniqueKey()}`} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{ref.name || "Name"}</h4>
                  <p className="text-gray-700">{ref.position || "Position"}</p>
                  <p className="text-gray-700">{ref.company || "Company"}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    {ref.email && <p>{ref.email}</p>}
                    {ref.phone && <p>{ref.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          );
          
          const height = await measureElement(referencesContent, false);
          return { element: referencesContent, height };
        })
      );

      const referencesHeader = (
        <div key={createUniqueKey()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-1">References</h3>
        </div>
      );

      sections.push({
        type: 'references',
        content: referencesHeader,
        items: referencesItems,
        canSplit: true,
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

    const addPage = (mainContent: React.ReactNode[], hasHeader: boolean = false) => {
      const pageContent = (
        <Card className="w-full bg-white border-none shadow-none rounded-none" style={{ width: '100%', height: '100%' }}>
          <CardContent className="py-8 px-12 shadow-none" style={{ 
            padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
            height: '100%'
          }}>
            {hasHeader && sections.find(s => s.isHeader)?.content}
            {mainContent}
          </CardContent>
        </Card>
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
        // Splittable section handling (experience, education, skills, certifications, references)
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
          fontFamily: 'sans-serif'
        }} />
      </div>
    );
  }

  // Final render
  return (
    <div className="template-container plain-template">
      <div ref={measurementRef} style={{ 
        position: 'absolute', 
        left: -9999, 
        top: -9999,
        width: `${A4_WIDTH}px`,
        fontFamily: 'sans-serif'
      }} />
      {pages.map((page, index) => (
        <Page key={page.key} pageNumber={index + 1} totalPages={pages.length} margins={margin} showFooter={showFooter}>
          {page.main}
        </Page>
      ))}
    </div>
  );
};

export default PlainTemplateNew;