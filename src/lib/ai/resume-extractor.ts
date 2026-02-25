import OpenAI from "openai";
import { ExtractedResumeData } from "../types/resume";

// Lazy initialization to avoid build-time errors
let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return client;
}

const EXTRACTION_PROMPT = `You are an expert resume parser. Extract structured information from the following resume text.

Return a JSON object with the following structure:
{
  "name": "Full name of the candidate",
  "email": "Email address or null",
  "phone": "Phone number or null",
  "location": "City, State/Country or null",
  "linkedinUrl": "LinkedIn URL or null",
  "portfolioUrl": "Portfolio/website URL or null",
  "currentCompany": "Most recent/current employer or null",
  "currentTitle": "Most recent/current job title or null",
  "yearsOfExperience": <number of years of total work experience, calculated from work history, or null>,
  "education": [
    {
      "institution": "School/University name",
      "degree": "Degree type (Bachelor's, Master's, PhD, etc.) or null",
      "fieldOfStudy": "Major/Field of study or null",
      "graduationYear": <4-digit year or null>,
      "gpa": "GPA as string or null"
    }
  ],
  "workExperience": [
    {
      "company": "Company name",
      "title": "Job title",
      "startDate": "YYYY-MM-DD or YYYY-MM or null",
      "endDate": "YYYY-MM-DD or YYYY-MM or null (null if current position)",
      "isCurrent": <boolean>,
      "description": "Job description/responsibilities or null",
      "location": "Job location or null"
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "programming" | "framework" | "tool" | "soft-skill" | "other",
      "proficiencyLevel": "beginner" | "intermediate" | "advanced" | "expert" | null,
      "yearsUsed": <number or null>
    }
  ]
}

Guidelines:
- Extract all information accurately from the resume text
- For yearsOfExperience, calculate the total years from work history (current year minus earliest start date, or sum of durations)
- For skills, categorize appropriately:
  - "programming": programming languages (JavaScript, Python, Java, etc.)
  - "framework": frameworks and libraries (React, Node.js, Django, etc.)
  - "tool": tools and platforms (Git, Docker, AWS, etc.)
  - "soft-skill": soft skills (communication, leadership, etc.)
  - "other": anything else
- If information is not available, use null
- Ensure the output is valid JSON only, no markdown code blocks

Resume text:
`;

export async function extractResumeData(
  resumeText: string
): Promise<ExtractedResumeData> {
  const completion = await getClient().chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: EXTRACTION_PROMPT + resumeText,
      },
    ],
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content || "";

  // Extract JSON from the response (it might be wrapped in markdown code blocks)
  let jsonStr = responseText;
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  try {
    const data = JSON.parse(jsonStr) as ExtractedResumeData;
    return data;
  } catch {
    throw new Error("Failed to parse extracted resume data as JSON");
  }
}
