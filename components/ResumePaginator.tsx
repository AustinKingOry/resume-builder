import React, { JSX, useEffect, useRef, useState } from "react";

const A4_PAGE_HEIGHT = 1123; // px

interface PaginatorProps {
  children: React.ReactNode;
}

export const Paginator: React.FC<PaginatorProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<JSX.Element[][]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const allChildren = Array.from(containerRef.current.children) as HTMLElement[];
    const childArray = React.Children.toArray(children);

    const newPages: JSX.Element[][] = [];
    let currentPage: JSX.Element[] = [];
    let currentHeight = 0;

    allChildren.forEach((el, idx) => {
      const elHeight = el.offsetHeight;
    //   console.log(children.getBoundingClientRect())

      if (currentHeight + elHeight <= A4_PAGE_HEIGHT) {
        currentPage.push(childArray[idx] as JSX.Element);
        currentHeight += elHeight;
      } else {
        newPages.push(currentPage);
        currentPage = [childArray[idx] as JSX.Element];
        currentHeight = elHeight;
      }
    });

    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages);
  }, [children]);

  return (
    <div>
      {/* hidden measurement container */}
      <div ref={containerRef} className="hidden absolute top-0 left-0 opacity-0 pointer-events-none">
        {children}
      </div>

      {/* rendered paginated content */}
      {pages.map((page, i) => (
        <div key={i} className="resume-wrapper">
          {page}
        </div>
      ))}
    </div>
  );
};
