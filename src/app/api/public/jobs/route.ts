import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateApiKey, corsHeaders } from "@/lib/apiAuth";

/**
 * Public API endpoint for listing open jobs
 * Used by the public recruitment website
 */
export async function GET(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return auth.error;
  }

  try {
    // Only return open jobs for public consumption
    const openJobs = await db
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
      .where(eq(jobs.status, "open"));

    return NextResponse.json(openJobs, {
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("Error fetching public jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
