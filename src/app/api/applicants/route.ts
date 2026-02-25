import { NextResponse } from "next/server";
import { db } from "@/db";
import { applicants, education, workExperience, skills, applicantSkills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const allApplicants = await db.select().from(applicants);
  return NextResponse.json(allApplicants);
}

interface EducationInput {
  institution: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  graduationYear?: number | null;
  gpa?: string | null;
}

interface WorkExperienceInput {
  company: string;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
  location?: string | null;
}

interface SkillInput {
  name: string;
  category?: string | null;
  proficiencyLevel?: string | null;
  yearsUsed?: number | null;
}

interface ApplicantInput {
  name: string;
  email: string;
  phone?: string | null;
  status?: string;
  position?: string | null;
  notes?: string | null;
  jobId?: number | null;
  resumeUrl?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  yearsOfExperience?: number | null;
  expectedSalary?: number | null;
  currentCompany?: string | null;
  currentTitle?: string | null;
  location?: string | null;
  source?: string | null;
  referredBy?: string | null;
  availableStartDate?: string | null;
  education?: EducationInput[];
  workExperience?: WorkExperienceInput[];
  skills?: SkillInput[];
}

// Helper to normalize date strings to YYYY-MM-DD format
function normalizeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  // If it's already YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // If it's YYYY-MM, append -01
  if (/^\d{4}-\d{2}$/.test(dateStr)) return `${dateStr}-01`;
  // If it's just YYYY, append -01-01
  if (/^\d{4}$/.test(dateStr)) return `${dateStr}-01-01`;
  return null;
}

export async function POST(request: Request) {
  const body: ApplicantInput = await request.json();

  // Extract nested data
  const { education: educationData, workExperience: workExperienceData, skills: skillsData, ...applicantData } = body;

  // If no nested data, use simple insert
  if (!educationData?.length && !workExperienceData?.length && !skillsData?.length) {
    const newApplicant = await db.insert(applicants).values(applicantData).returning();
    return NextResponse.json(newApplicant[0], { status: 201 });
  }

  // Use transaction for nested data
  const result = await db.transaction(async (tx) => {
    // 1. Insert applicant
    const [newApplicant] = await tx.insert(applicants).values(applicantData).returning();
    const applicantId = newApplicant.id;

    // 2. Insert education records
    if (educationData?.length) {
      await tx.insert(education).values(
        educationData.map(edu => ({
          applicantId,
          institution: edu.institution,
          degree: edu.degree || null,
          fieldOfStudy: edu.fieldOfStudy || null,
          graduationYear: edu.graduationYear || null,
          gpa: edu.gpa || null,
        }))
      );
    }

    // 3. Insert work experience records
    if (workExperienceData?.length) {
      await tx.insert(workExperience).values(
        workExperienceData.map(exp => ({
          applicantId,
          company: exp.company,
          title: exp.title,
          startDate: normalizeDate(exp.startDate),
          endDate: normalizeDate(exp.endDate),
          isCurrent: exp.isCurrent || false,
          description: exp.description || null,
          location: exp.location || null,
        }))
      );
    }

    // 4. Find/create skills and link to applicant
    if (skillsData?.length) {
      for (const skillData of skillsData) {
        // Check if skill exists
        const existingSkills = await tx
          .select()
          .from(skills)
          .where(eq(skills.name, skillData.name));

        let skillId: number;

        if (existingSkills.length > 0) {
          skillId = existingSkills[0].id;
        } else {
          // Create new skill
          const [newSkill] = await tx.insert(skills).values({
            name: skillData.name,
            category: skillData.category || null,
          }).returning();
          skillId = newSkill.id;
        }

        // Link skill to applicant
        await tx.insert(applicantSkills).values({
          applicantId,
          skillId,
          proficiencyLevel: skillData.proficiencyLevel || null,
          yearsUsed: skillData.yearsUsed || null,
        });
      }
    }

    return newApplicant;
  });

  return NextResponse.json(result, { status: 201 });
}
