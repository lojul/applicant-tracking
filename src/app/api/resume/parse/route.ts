import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

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
    const data = new Uint8Array(arrayBuffer);

    // Parse the PDF using PDFParse
    const pdfParser = new PDFParse({ data });
    const textResult = await pdfParser.getText();
    await pdfParser.destroy();

    return NextResponse.json({ text: textResult.text }, { status: 200 });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
