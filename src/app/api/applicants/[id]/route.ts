import { NextResponse } from "next/server";
import { db } from "@/db";
import { applicants, jobs, education, workExperience, interviews, documents, applicantSkills, skills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const applicantId = parseInt(id);

  const applicant = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, applicantId));

  if (applicant.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch related data in parallel
  const [jobData, educationData, workExperienceData, interviewsData, documentsData, skillsData] = await Promise.all([
    // Get job info if jobId exists
    applicant[0].jobId
      ? db.select().from(jobs).where(eq(jobs.id, applicant[0].jobId))
      : Promise.resolve([]),
    // Get education history
    db.select().from(education).where(eq(education.applicantId, applicantId)),
    // Get work experience
    db.select().from(workExperience).where(eq(workExperience.applicantId, applicantId)),
    // Get interviews
    db.select().from(interviews).where(eq(interviews.applicantId, applicantId)),
    // Get documents
    db.select().from(documents).where(eq(documents.applicantId, applicantId)),
    // Get skills with join
    db.select({
      id: applicantSkills.id,
      skillId: applicantSkills.skillId,
      skillName: skills.name,
      category: skills.category,
      proficiencyLevel: applicantSkills.proficiencyLevel,
      yearsUsed: applicantSkills.yearsUsed,
    })
    .from(applicantSkills)
    .innerJoin(skills, eq(applicantSkills.skillId, skills.id))
    .where(eq(applicantSkills.applicantId, applicantId)),
  ]);

  return NextResponse.json({
    ...applicant[0],
    job: jobData[0] || null,
    education: educationData,
    workExperience: workExperienceData,
    interviews: interviewsData,
    documents: documentsData,
    skills: skillsData,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const updated = await db
    .update(applicants)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(applicants.id, parseInt(id)))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await db
    .delete(applicants)
    .where(eq(applicants.id, parseInt(id)))
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
