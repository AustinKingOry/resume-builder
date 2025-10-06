## Template Enhancement Prompt

**GOAL**: Convert this template to support automatic A4 pagination with custom margins while preserving its unique design and layout.

**REQUIREMENTS**:

### 1. Pagination System
- Automatically split content across multiple A4 pages (794px × 1123px)
- Prevent content from being cut off between pages
- Add page numbers (X of Y) in footer
- Handle content overflow intelligently

### 2. Custom Margins
- Accept `margins` prop: `{ top?: number; right?: number; bottom?: number; left?: number }`
- Default margins: 20px all around
- Adjust content sizing and pagination based on margins
- Maintain proper spacing in print

### 3. Layout Preservation
- Maintain original template's visual design and structure
- Keep existing CSS classes and styling
- Preserve sidebar layouts if present (sidebar should continue across pages, not repeat)
- Maintain responsive design principles

### 4. Implementation Guidelines

**For templates WITH sidebars**:
- Split sidebar content across pages (don't repeat same content)
- Continue main content alongside sidebar pages
- Handle sidebar and main content pagination separately but coordinated

**For templates WITHOUT sidebars**:
- Use full-width layout on all pages
- Implement continuous content flow across pages

**Key files to modify**:
- Template component file (e.g., `ModernTemplate.tsx`)
- Corresponding CSS file (e.g., `modern.css`)

**Critical functions to implement**:
- Content measurement and height calculation
- Automatic page splitting logic
- Margin-aware layout adjustments
- Print-optimized styling

### 5. Expected Props Interface
```typescript
interface TemplateProps {
  data: ResumeData;
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
```

### 6. Output Requirements
- Zero content repetition across pages
- Professional page breaks
- Consistent styling throughout all pages
- Proper PDF export compatibility
- Maintain original template's unique branding

---

## Template-Specific Instructions

**For this specific template**, please address:

1. **Layout Type**: [Does this template have a sidebar? If yes, describe its content]
2. **Unique Features**: [List any special design elements that must be preserved]
3. **Content Structure**: [How are sections organized? Any special components?]
4. **Current Issues**: [Any known layout problems that should be fixed during conversion?]

**Example for a sidebar template**:
- Layout Type: Two-column layout with photo, contact info, and skills in sidebar
- Unique Features: Gradient background in sidebar, skill progress bars
- Content Structure: Main content has summary, experience, education sections
- Current Issues: Sidebar content gets cut off on single page

**Example for a single-column template**:
- Layout Type: Full-width single column with header
- Unique Features: Colorful section headers, timeline design for experience
- Content Structure: All content in one continuous column
- Current Issues: No pagination support

---

## Quick Checklist
- [ ] Automatic A4 pagination implemented
- [ ] Custom margins prop accepted and applied
- [ ] Page numbers added to footer
- [ ] Content properly split across pages (no cuts)
- [ ] Original styling preserved
- [ ] Sidebar content continues across pages (if applicable)
- [ ] Print styles optimized
- [ ] No content repetition
- [ ] All existing functionality maintained