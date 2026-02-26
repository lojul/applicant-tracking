import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applicants, documents } from "@/db/schema";
import { validateApiKey, corsHeaders } from "@/lib/apiAuth";

interface ApplicationPayload {
  jobId: number;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  coverLetter?: string;
  whyFit?: string;
  openToOtherRoles?: boolean;
}

/**
 * Public API endpoint for submitting job applications
 * Used by the public recruitment website
 */
export async function POST(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return auth.error;
  }

  try {
    const body: ApplicationPayload = await request.json();

    // Validate required fields
    if (!body.jobId || !body.name || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: jobId, name, email" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create the applicant record
    const [newApplicant] = await db
      .insert(applicants)
      .values({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        linkedinUrl: body.linkedinUrl || null,
        resumeUrl: body.resumeUrl || null,
        jobId: body.jobId,
        status: "applied",
        source: "company-website",
        notes: body.whyFit
          ? `Why they're a fit: ${body.whyFit}${body.openToOtherRoles ? "\n\nOpen to other roles: Yes" : ""}`
          : body.openToOtherRoles
            ? "Open to other roles: Yes"
            : null,
      })
      .returning();

    // If there's a cover letter, save it as a document
    if (body.coverLetter) {
      await db.insert(documents).values({
        applicantId: newApplicant.id,
        name: "Cover Letter",
        type: "cover-letter",
        url: `data:text/plain;base64,${Buffer.from(body.coverLetter).toString("base64")}`,
      });
    }

    return NextResponse.json(
      {
        success: true,
        applicationId: newApplicant.id,
        message: "Application submitted successfully",
      },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
