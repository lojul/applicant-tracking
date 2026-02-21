import { NextResponse } from "next/server";
import { db } from "@/db";
import { applicants } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

export async function GET() {
  // Get counts by status
  const statusCounts = await db
    .select({
      status: applicants.status,
      count: sql<number>`count(*)::int`,
    })
    .from(applicants)
    .groupBy(applicants.status);

  // Get total count
  const totalResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(applicants);
  const total = totalResult[0]?.count ?? 0;

  // Get recent applicants (last 5)
  const recent = await db
    .select()
    .from(applicants)
    .orderBy(desc(applicants.createdAt))
    .limit(5);

  // Build status map with all statuses
  const allStatuses = ['applied', 'interviewing', 'offered', 'rejected', 'hired'];
  const statusMap: Record<string, number> = {};
  allStatuses.forEach(s => statusMap[s] = 0);
  statusCounts.forEach(row => {
    statusMap[row.status] = row.count;
  });

  return NextResponse.json({
    total,
    byStatus: statusMap,
    recent,
  });
}
