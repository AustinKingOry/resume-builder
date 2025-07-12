import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"
import type { AIGenerationRequest } from "@/lib/types"

// Fallback suggestions for when AI fails
const fallbackSuggestions = {
  summary: [
    "Results-driven professional with 3+ years of experience in technology solutions and client relationship management. Proven track record of exceeding performance targets and delivering exceptional customer service in fast-paced environments.",
    "Experienced technology professional specializing in sales and customer success with demonstrated ability to build strong client relationships and drive revenue growth. Strong analytical and communication skills with focus on solution-oriented approaches.",
    "Mid-level professional with expertise in technology sales and project coordination. Committed to continuous learning and professional development with strong problem-solving abilities and team collaboration skills.",
  ],
  "job-description": [
    "• Managed client relationships and achieved 95% customer satisfaction through proactive communication and problem resolution",
    "• Exceeded quarterly sales targets by 15% through strategic prospecting and effective presentation of technology solutions",
    "• Collaborated with cross-functional teams to deliver projects on time and within budget constraints",
    "• Implemented process improvements that increased team efficiency by 20% and reduced response times",
    "• Provided technical support and training to clients, resulting in improved product adoption and retention rates",
  ],
  skills: [
    "Customer Relationship Management",
    "Sales Strategy",
    "Technical Communication",
    "Project Management",
    "Data Analysis",
    "Problem Solving",
    "Team Leadership",
    "Client Presentations",
    "Market Research",
    "Process Improvement",
  ],
  accomplishments: [
    "• Successfully increased sales revenue by 25% over 12 months through strategic account management and new client acquisition",
    "• Led implementation of new CRM system that improved team productivity by 30% and enhanced customer tracking capabilities",
    "• Achieved 98% client retention rate by developing strong relationships and providing exceptional ongoing support",
    "• Reduced project delivery time by 20% through process optimization and improved team coordination",
    "• Mentored 3 junior team members, resulting in improved performance metrics and successful career advancement",
  ],
}

export async function POST(request: NextRequest) {
  try {
    // console.log("AI Generation API called")

    const body: AIGenerationRequest = await request.json()
    const { type, context } = body

    // console.log("Request type:", type)
    // console.log("Context:", context)

    // Check if Google AI API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn("Google AI API key not found, using fallback suggestions")
      return NextResponse.json({
        suggestions: fallbackSuggestions[type] || ["No suggestions available"],
        fallback: true,
      })
    }

    let prompt = ""
    const systemPrompt = `You are a professional resume writing assistant. Generate ready-to-use, specific content that can be directly copied into a resume. Do not provide templates, placeholders, or instructions. Write complete, professional content based on the information provided.

Rules:
- Write actual content, not templates with brackets
- Be specific and professional
- Use industry-appropriate language
- Make reasonable assumptions when details are missing
- Keep responses concise and actionable
- Each suggestion should be complete and ready to use`

    switch (type) {
      case "summary":
        prompt = `Write 3 complete professional summaries for a ${context.jobTitle || "professional"} role. Use this information:
    - Job Title: ${context.jobTitle || "Professional"}
    - Industry: ${context.industry || "Technology"}
    - Experience Level: ${context.experience || "Mid-level"}
    - Location: ${context.personalInfo?.location || ""}
    
    Make each summary 2-3 sentences, highlighting relevant skills and experience. Write complete summaries that can be used immediately, not templates. If specific details are missing, make reasonable professional assumptions.
    
    Format: Return only the 3 summaries, one per line, without numbering or bullet points.`
        break

      case "job-description":
        prompt = `Write 5 professional bullet points for a ${context.jobTitle || "Professional"} position at ${context.company || "a technology company"}. 
    
    Create specific, achievement-focused bullet points that include:
    - Concrete responsibilities and accomplishments
    - Realistic metrics and numbers
    - Industry-appropriate tasks
    - Professional language
    
    Make reasonable assumptions about typical responsibilities for this role. Each bullet point should start with a strong action verb.
    
    Format: Return 5 bullet points, each starting with "•" and on a separate line.`
        break

      case "skills":
        prompt = `List 10 relevant skills for a ${context.jobTitle || "professional"} in ${context.industry || "technology"}. 
    
    Include a mix of:
    - Technical skills relevant to the role
    - Soft skills important for the position  
    - Industry-specific competencies
    - Tools and technologies commonly used
    
    Current skills they have: ${context.skills?.join(", ") || "None specified"}
    
    Format: Return only skill names separated by commas, no explanations or categories.`
        break

      case "accomplishments":
        prompt = `Write 5 specific professional accomplishments for a ${context.jobTitle || "professional"} role.
    
    Each accomplishment should:
    - Include realistic metrics or percentages
    - Show clear business impact
    - Use strong action verbs
    - Be specific and measurable
    - Sound professional and achievable
    
    Make reasonable assumptions about typical achievements for this role level and industry.
    
    Format: Return 5 bullet points, each starting with "•" and on a separate line.`
        break

      default:
        console.error("Invalid generation type:", type)
        return NextResponse.json({
          suggestions: fallbackSuggestions[type as keyof typeof fallbackSuggestions] || ["Invalid request type"],
          fallback: true,
        })
    }

    // console.log("Attempting AI generation with prompt:", prompt.substring(0, 100) + "...")

    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // console.log("AI response received:", text.substring(0, 100) + "...")

      // Parse the response into an array of suggestions
      let suggestions = text
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) =>
          line
            .replace(/^[-•*]\s*/, "")
            .replace(/^\d+\.\s*/, "")
            .trim(),
        )
        .filter((line) => line.length > 10)

      // If no valid suggestions were parsed, use fallback
      if (suggestions.length === 0) {
        console.warn("No valid suggestions parsed from AI response, using fallback")
        suggestions = fallbackSuggestions[type] || ["No suggestions available"]
      }

      // console.log("Parsed suggestions:", suggestions.length, "items")

      return NextResponse.json({ suggestions, fallback: false })
    } catch (aiError) {
      console.error("AI generation failed:", aiError)

      // Return fallback suggestions when AI fails
      return NextResponse.json({
        suggestions: fallbackSuggestions[type] || ["AI temporarily unavailable"],
        fallback: true,
        error: "AI service temporarily unavailable",
      })
    }
  } catch (error) {
    console.error("API route error:", error)

    // Return fallback suggestions for any other errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorType = (error as any)?.body?.type || "summary"
    return NextResponse.json(
      {
        suggestions: fallbackSuggestions[errorType as keyof typeof fallbackSuggestions] || [
          "Unable to generate suggestions at this time. Please try again later.",
        ],
        fallback: true,
        error: "Service temporarily unavailable",
      },
      { status: 200 },
    ) // Return 200 to avoid client-side errors
  }
}
