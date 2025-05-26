import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authService } from "@/services/auth";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/images",
  "/icons",
  "/models",
  "/favicon.ico",
  "/_next",
  "/static",
];

// Paths that require admin role
const adminPaths = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return NextResponse.next();
  }

  // First try to get token from Authorization header (for API requests)
  let token = null;
  const authHeader = request.headers.get("Authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    // For browser requests, try to get token from cookies
    const tokenCookie = request.cookies.get("token");
    if (tokenCookie && tokenCookie.value) {
      token = tokenCookie.value;
    }
  }

  // If no token found, redirect to login
  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify token
    const payload = await authService.verifyToken(token);

    // Check for admin routes
    if (
      adminPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
      )
    ) {
      if (payload.role !== "admin") {
        // For API routes, return 403
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Unauthorized: Admin access required" },
            { status: 403 }
          );
        }
        // For page routes, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Add user info to headers for API routes
    if (pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-role", payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);

    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - icons (static icons)
     * - models (static models)
     * - static (static assets)
     * - *.html (HTML files)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|models/|static/|.*\\.html$).*)",
  ],
};
