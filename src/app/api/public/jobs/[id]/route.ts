import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { validateApiKey, corsHeaders } from "@/lib/apiAuth";

/**
 * Public API endpoint for getting a single job detail
 * Used by the public recruitment website
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Only return if job is open
    const [job] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        department: jobs.department,
        description: jobs.description,
        requirements: jobs.requirements,
        location: jobs.location,
        isRemote: jobs.isRemote,
        employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.status, "open")));

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(job, {
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
