// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for assets, fonts, internal pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".otf") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Read the client-readable session cookie
  const token = req.cookies.get("access");

  // 3. Define public routes
  const publicRoutes = ["/", "/login", "/register", "/verify-email"];

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 4. Redirect unauthenticated users navigating to protected routes
  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname); // Save redirect target
    return NextResponse.redirect(loginUrl);
  }

  // 5. Prevent logged-in users from visiting login/register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/chat", req.url)); // Send to main panel
  }

  return NextResponse.next();
}
