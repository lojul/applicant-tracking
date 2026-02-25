import { NextResponse } from "next/server";
import { extractResumeData } from "@/lib/ai/resume-extractor";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const extractedData = await extractResumeData(text);

    return NextResponse.json(extractedData, { status: 200 });
  } catch (error) {
    console.error("Error extracting resume data:", error);
    return NextResponse.json(
      { error: "Failed to extract resume data" },
      { status: 500 }
    );
  }
}
