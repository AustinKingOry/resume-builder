import mammoth from "mammoth"
import pdf from 'pdf-parse';

export interface ParsedCV {
  text: string
  metadata: {
    fileName: string
    fileSize: number
    fileType: string
    pageCount?: number
    wordCount: number
  }
}

export async function parseCV(file: File): Promise<ParsedCV> {
  const fileType = file.type
  let text = ""
  let pageCount: number | undefined

  try {
    if (fileType === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      // const result = await parsePDF(file)
      const result = await pdf(buffer);
      text = result.text
      pageCount = result.numpages
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await parseWord(file)
    } else {
      throw new Error("Unsupported file type")
    }

    // Clean up the text
    text = cleanText(text)

    // Validate that we extracted meaningful content
    if (text.length < 50) {
      throw new Error("Could not extract enough text from the document. Please ensure your CV contains readable text.")
    }

    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length

    return {
      text,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType,
        pageCount,
        wordCount,
      },
    }
  } catch (error) {
    console.error("Error parsing CV:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to parse your CV. Please make sure it's a valid PDF or Word document with readable text.",
    )
  }
}

// async function parsePDF(file: File): Promise<{ text: string; pageCount: number }> {
//   const arrayBuffer = await file.arrayBuffer()
//   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
//   const pageCount = pdf.numPages

//   let fullText = ""

//   for (let i = 1; i <= pageCount; i++) {
//     const page = await pdf.getPage(i)
//     const textContent = await page.getTextContent()
//     const pageText = textContent.items
//       .map((item: any) => item.str)
//       .join(" ")
//       .trim()
//     fullText += pageText + "\n"
//   }

//   return { text: fullText, pageCount }
// }

async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

function cleanText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove special characters that might interfere with analysis
      .replace(/[^\w\s\-@.,()]/g, " ")
      // Trim and normalize
      .trim()
  )
}

export function validateCVContent(text: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = []
  const lowercaseText = text.toLowerCase()

  // Check for basic CV sections
  const hasSummary = /summary|profile|about|objective/i.test(text)
  const hasExperience = /experience|work|employment|job/i.test(text)
  const hasEducation = /education|school|university|degree|diploma/i.test(text)
  const hasContact = /@|phone|email|contact/i.test(text)

  if (!hasSummary) {
    issues.push("Missing professional summary or objective section")
  }
  if (!hasExperience) {
    issues.push("Missing work experience section")
  }
  if (!hasEducation) {
    issues.push("Missing education section")
  }
  if (!hasContact) {
    issues.push("Missing contact information")
  }

  // Check for common issues
  if (text.length < 200) {
    issues.push("CV content seems too short")
  }
  if (text.length > 5000) {
    issues.push("CV content might be too long")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}