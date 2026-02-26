import { NextRequest, NextResponse } from "next/server";

/**
 * Validates the API key for public API endpoints.
 * The public recruitment website will use this key to access ATS data.
 */
export function validateApiKey(request: NextRequest): { valid: boolean; error?: NextResponse } {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.RECRUIT_API_KEY;

  if (!expectedKey) {
    console.error("RECRUIT_API_KEY not configured in environment");
    return {
      valid: false,
      error: NextResponse.json(
        { error: "API not configured" },
        { status: 500 }
      ),
    };
  }

  if (!apiKey || apiKey !== expectedKey) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      ),
    };
  }

  return { valid: true };
}

/**
 * CORS headers for cross-origin requests from the public website
 */
export function corsHeaders(allowedOrigin?: string) {
  const origin = allowedOrigin || process.env.RECRUIT_WEBSITE_URL || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  };
}
