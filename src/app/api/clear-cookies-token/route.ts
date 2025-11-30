import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Remove the auth cookie
    const response = NextResponse.json({ message: "Cookie cleared" });
    response.cookies.set("user-authenticated", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Clearing token failed" },
      { status: 400 }
    );
  }
}
