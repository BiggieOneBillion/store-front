import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/services/api/auth"; // Adjust path as needed

export async function POST(request: NextRequest) {
  try {
    const { refreshToken, userId } = await request.json();

    // Call your backend/service logout function
    await logoutUser({ refreshToken, userId });

    // Remove the auth cookie
    const response = NextResponse.json({ message: "Logged out" });

    response.cookies.set("user-authenticated", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Logout failed" },
      { status: 400 }
    );
  }
}
