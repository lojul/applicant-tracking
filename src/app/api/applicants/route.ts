import { NextResponse } from "next/server";
import { db } from "@/db";
import { applicants } from "@/db/schema";

export async function GET() {
  const allApplicants = await db.select().from(applicants);
  return NextResponse.json(allApplicants);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newApplicant = await db.insert(applicants).values(body).returning();
  return NextResponse.json(newApplicant[0], { status: 201 });
}
