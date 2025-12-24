import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("user-authenticated");

  const specialPaths = ["/checkout", "/account"]; //! Paths that require authentication
  //! do not add /auth to the special paths as it is handled separately in the authchecker page

  // If the request is not for a special path, allow it to pass through
  // if (!specialPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
  //   return NextResponse.next();
  // }

  // Block access to /auth if already authenticated
  if (request.nextUrl.pathname.startsWith("/auth") && token) {
    // const referer = request.headers.get("referer");
    const url = request.nextUrl.clone();
    // // console.log("referer", referer);
    // if (referer) {
    //   // Use referer if available
    //   url.href = referer;
    // } else {
    //   // Fallback to home page
    //   url.pathname = "/";
    // }
    url.pathname = "/authchecker";

    // // console.log("Redirecting to authchecker", url.href);
    // Redirect to authchecker if authenticated
    // This is to ensure that the user is redirected to the authchecker page
    // which will handle the logout and redirection logic
    // This is useful for cases where the user tries to access the auth page directly
    // while already authenticated.
    // This way, we can ensure that the user is redirected to the authchecker page
    // which will handle the logout and redirection logic.
    // This is useful for cases where the user tries to access the auth page directly
    // while already authenticated.
    // This way, we can ensure that the user is redirected to the authchecker page
    // which will handle the logout and redirection logic.
    return NextResponse.redirect(url);
  }

  const conditions =
    specialPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !token;

  // // Block access to /checkout if NOT authenticated
  if (conditions) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // // Block access to /checkout if NOT authenticated
  // if (request.nextUrl.pathname.startsWith("/checkout") && !token) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/account/:path*", "/auth"],
};
