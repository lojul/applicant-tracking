import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";

export async function GET() {
  const allJobs = await db.select().from(jobs);
  return NextResponse.json(allJobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newJob = await db.insert(jobs).values(body).returning();
  return NextResponse.json(newJob[0], { status: 201 });
}
