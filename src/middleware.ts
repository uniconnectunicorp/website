import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page is always accessible — no redirects
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Protect /admin routes — lightweight cookie check
  // Full auth validation happens in the admin layout server component
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
