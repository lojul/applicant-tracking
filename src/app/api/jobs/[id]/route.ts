import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const job = await db.select().from(jobs).where(eq(jobs.id, id));

  if (job.length === 0) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job[0]);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const body = await request.json();

  const updatedJob = await db
    .update(jobs)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  if (updatedJob.length === 0) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(updatedJob[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  const deletedJob = await db.delete(jobs).where(eq(jobs.id, id)).returning();

  if (deletedJob.length === 0) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Job deleted successfully" });
}
