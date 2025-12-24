import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is trying to access the checkout page
  if (request.nextUrl.pathname.startsWith("/checkout")) {
    // console.log("Main work!!", request.cookies.getAll());
    // Example: Check for an "auth-token" cookie
    const token = request.cookies.get("user-authenticated");
    if (token) {
      // console.log("User is authenticated:", token);
    }
    if (!token) {
      // console.log("User is not authenticated:", token);

      // Redirect to /auth if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

// Specify the paths where this middleware should run
export const config = {
  matcher: ["/checkout/:path*"],
};
