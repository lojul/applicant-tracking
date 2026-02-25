import { NextResponse } from "next/server";
// @ts-expect-error - pdf-parse v1 has no types
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Fetch the PDF from the URL
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch PDF" },
        { status: 400 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF using pdf-parse v1
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text }, { status: 200 });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
