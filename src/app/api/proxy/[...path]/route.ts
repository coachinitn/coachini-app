import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Secure API Proxy
 * Handles all authenticated requests to the backend
 * Tokens never leave the server-side
 *
 * Security Features:
 * - Server-side token handling
 * - Path traversal protection
 * - Request timeout handling
 * - Proper error responses
 * - Request logging (dev only)
 */

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    // Validate environment variables
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is not configured');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not configured');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get the JWT token server-side
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.accessToken) {
      console.warn('Proxy request without valid authentication token');
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Rate limiting check
    if (!checkRateLimit(token.id as string)) {
      console.warn(`Rate limit exceeded for user: ${token.id}`);
      return NextResponse.json(
        { error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    // Validate and sanitize the path
    if (!params.path || params.path.length === 0) {
      return NextResponse.json(
        { error: "Invalid API path" },
        { status: 400 }
      );
    }

    // Security: Prevent path traversal attacks
    const sanitizedPath = params.path
      .filter(segment => segment && !segment.includes('..') && !segment.includes('~'))
      .join('/');

    if (!sanitizedPath) {
      return NextResponse.json(
        { error: "Invalid API path" },
        { status: 400 }
      );
    }

    // Reconstruct the backend API path
    const backendPath = `/${sanitizedPath}`;
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}${backendPath}`;

    // Forward query parameters (with validation)
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const finalUrl = searchParams ? `${backendUrl}?${searchParams}` : backendUrl;

    // Log the proxied request (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PROXY] ${method} ${backendPath} -> ${finalUrl}`);
    }

    // Check token expiration
    if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
      console.warn('Access token has expired, request may fail');
      // Don't block the request - let NextAuth handle refresh
    }

    // Prepare headers for backend request
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token.accessToken}`,
      'User-Agent': 'coachini-app-proxy/1.0',
      'X-Forwarded-For': request.headers.get('x-forwarded-for') || 'unknown',
    };

    // Get request body if present
    let body: string | FormData | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const contentType = request.headers.get('content-type');

        if (contentType?.includes('multipart/form-data')) {
          // Handle file uploads
          body = await request.formData();
        } else {
          // Handle JSON requests
          headers['Content-Type'] = 'application/json';
          const requestBody = await request.text();
          body = requestBody || undefined;
        }
      } catch (error) {
        console.warn('Failed to parse request body:', error);
        body = undefined;
      }
    }

    // Make the request to the backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const backendResponse = await fetch(finalUrl, {
        method,
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle authentication errors from backend
      if (backendResponse.status === 401) {
        console.warn('Backend returned 401, token may be invalid or expired');
        return NextResponse.json(
          { error: "Authentication failed", code: "TOKEN_INVALID" },
          { status: 401 }
        );
      }

      // Handle other error responses
      if (!backendResponse.ok && backendResponse.status >= 500) {
        console.error(`Backend error: ${backendResponse.status} ${backendResponse.statusText}`);
      }

      // Forward the response
      const responseData = await backendResponse.text();

      return new NextResponse(responseData, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: {
          'Content-Type': backendResponse.headers.get('Content-Type') || 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('Backend request timeout');
        return NextResponse.json(
          { error: "Request timeout", code: "TIMEOUT" },
          { status: 504 }
        );
      }

      console.error('Backend request failed:', fetchError);
      return NextResponse.json(
        { error: "Backend request failed", code: "BACKEND_ERROR" },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
